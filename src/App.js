import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  View,
  Epic,
  ScreenSpinner,
  usePlatform,
  PanelHeaderBack,
  Panel,
  Group,
  Cell,
  PanelHeader,
  useAdaptivityConditionalRender,
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  SplitLayout,
  SplitCol,
  Platform,
  Snackbar,
  Avatar,
  Button,
  Div,
  Link,
  SimpleCell,
  Switch,
  CardGrid,
  Card,
  Title,
  Text,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {
  Icon28ServicesOutline,
  Icon28MessageOutline,
  Icon28UserCircleOutline,
  Icon24Error,
} from '@vkontakte/icons';
import { withRouter, useRouterSelector, useRouterActions } from 'react-router-vkminiapps';
import { ViewTypes, PanelTypes } from './routing/structure.ts';
import Gallery from './components/Gallery/index';
import CreateAvatar from './panels/CreateAvatar/index';
import CustomTabbar from './components/CustomTabbar';
import ShowSlides from './services/OnboardingService';

const STORAGE_KEYS = {
  STATE: 'state',
  STATUS: 'viewStatus',
  NOTIFICATION: 'isNotific',
};

const App = ({ router }) => {
  const { activeView, activePanel } = useRouterSelector();
  const { toView, toBack } = useRouterActions();
  const [fetchedUser, setUser] = useState(null);

  const [snackbar, setSnackbar] = useState(null);

  const [isNotific, setNotific] = useState();
  const [fetchedState, setFetchedState] = useState(null);

  const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

  const platform = usePlatform();
  const { viewWidth } = useAdaptivityConditionalRender();
  const activeStoryStyles = {
    backgroundColor: 'var(--vkui--color_background_secondary)',
    borderRadius: 8,
  };
  const hasHeader = platform !== Platform.VKCOM;

  useEffect(() => {
    async function fetchNotificationSetting() {
      try {
        const storageData = await bridge.send('VKWebAppStorageGet', {
          keys: [STORAGE_KEYS.NOTIFICATION],
        });
        console.log('storageData', storageData);
        const storedValue = storageData.keys[0]?.value;
        setNotific(storedValue === '1');
      } catch (error) {
        console.error('Error fetching notification setting:', error);
      }
    }

    fetchNotificationSetting();
  }, []);

  const setNotification = async () => {
    try {
      const newValue = isNotific ? '0' : '1';
      const setResult = await bridge.send(
        isNotific ? 'VKWebAppDenyNotifications' : 'VKWebAppAllowNotifications',
      );
      if (setResult.result) {
        await bridge.send('VKWebAppStorageSet', {
          key: STORAGE_KEYS.NOTIFICATION,
          value: newValue,
        });
        setNotific(!isNotific);
      } else {
        console.error('Error setting notification:', setResult.error_data);
      }
    } catch (error) {
      console.error('Error setting notification:', error);
    }
  };

  const switchHandler = (evant) => {
    setNotific(evant.currentTarget.checked);
    setNotification();
  };

  useEffect(() => {
    bridge.send('VKWebAppInit');
    // bridge
    //   .send('VKWebAppGetLaunchParams')
    //   .then((data) => {
    //     if (data) {
    //       console.log(data, 'data11111111111111111 ');
    //       console.log(data.vk_are_notifications_enabled, 'data.vk_are_notifications_enabled');

    //       if (data.vk_are_notifications_enabled === 1) {
    //         setNotific(true);
    //         console.log(true, 'setNotific true');
    //       } else {
    //         setNotific(false);
    //         console.log(false, 'setNotific false');
    //       }
    //     } else {
    //       // Ошибка
    //     }
    //   })
    //   .catch((error) => {
    //     // Ошибка
    //     console.log(error);
    //   });

    bridge.isWebView();
    // isShowedSlidesSheet().then((isShowed) => {
    //   if (!isShowed) {
    //     console.log('Пользователь еще не видел онбординг');
    //     ShowSlides();
    //   }
    // });
  }, []);

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme');
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
        document.body.attributes.setNamedItem(schemeAttribute);
      }
      // console.log(type, 'type');
      // console.log(data, 'data');
    });

    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      // const user1231 = await bridge.send('VKWebAppAllowNotificationsResult');
      // console.log(user1231, 'user1231');
      const sheetState = await bridge.send('VKWebAppStorageGet', {
        keys: [STORAGE_KEYS.STATE, STORAGE_KEYS.STATUS],
      });
      if (Array.isArray(sheetState.keys)) {
        const data = {};
        sheetState.keys.forEach(({ key, value }) => {
          try {
            data[key] = value ? JSON.parse(value) : {};

            switch (key) {
              case STORAGE_KEYS.STATE:
                setFetchedState(data[STORAGE_KEYS.STATE]);
                break;
              case STORAGE_KEYS.STATUS:
                ShowSlides();
                if (data[key] && data[key].hasSeenIntro) {
                  activePanel(ViewTypes.MAIN);
                  ShowSlides();
                }
                break;
              default:
                break;
            }
          } catch (error) {
            setSnackbar(
              <Snackbar
                layout="vertical"
                onClose={() => setSnackbar(null)}
                before={
                  <Avatar size={24} style={{ backgroundColor: 'var(--dynamic_red)' }}>
                    <Icon24Error fill="#fff" width={14} height={14} />
                  </Avatar>
                }
                duration={900}
              >
                Проблема с получением данных из Storage
              </Snackbar>,
            );
            setFetchedState({});
          }
        });
      } else {
        setFetchedState({});
      }
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout
            popout={popout}
            header={hasHeader && <PanelHeader separator={false} />}
            style={{ justifyContent: 'center' }}
          >
            {viewWidth.tabletPlus && (
              <SplitCol className={viewWidth.tabletPlus.className} fixed width={280} maxWidth={280}>
                <Panel>
                  {hasHeader && <PanelHeader />}
                  <Group>
                    <Cell
                      disabled={activeView === 'SERVICE'}
                      style={activeView === 'SERVICE' ? activeStoryStyles : undefined}
                      data-story="SERVICE"
                      onClick={() => toView(ViewTypes.SERVICES)}
                      before={<Icon28ServicesOutline />}
                    >
                      Мои аватары
                    </Cell>
                    <Cell
                      disabled={activeView === 'MAIN'}
                      style={activeView === 'MAIN' ? activeStoryStyles : undefined}
                      data-story="MAIN"
                      onClick={() => toView(ViewTypes.MAIN)}
                      before={<Icon28MessageOutline />}
                    >
                      Создать аватар
                    </Cell>

                    {/* <Cell
                      disabled={activeView === 'PROFILE'}
                      style={activeView === 'PROFILE' ? activeStoryStyles : undefined}
                      data-story="PROFILE"
                      onClick={() => toView(ViewTypes.PROFILE)}
                      before={<Icon28UserCircleOutline />}
                    >
                      Профиль
                    </Cell> */}
                  </Group>
                </Panel>
              </SplitCol>
            )}

            <SplitCol
              width="100%"
              maxWidth="560px"
              stretchedOnMobile
              // autoSpaced
            >
              <Epic
                activeStory={router.activeView}
                tabbar={viewWidth.tabletMinus && <CustomTabbar router={router} />}
              >
                <View id={ViewTypes.SERVICES} activePanel={router.activePanel}>
                  <Panel id={PanelTypes.SERVICES}>
                    <PanelHeader before={<PanelHeaderBack onClick={toBack} />}>
                      Мои аватары
                    </PanelHeader>
                    <Group style={{ height: '700px' }}>
                      <Card>
                        <div style={{ padding: '15px 20px' }}>
                          Для получения уведомлений о завершении генераций, напишите
                          &lsquo;Начать&lsquo; в диалог с группой -{' '}
                          <Link href="https://vk.me/club22352015">https://vk.me/club22352015</Link>
                        </div>
                      </Card>
                      <Gallery />
                    </Group>
                  </Panel>
                </View>
                <View id={ViewTypes.MAIN} activePanel={router.activePanel}>
                  <Panel id={PanelTypes.MAIN}>
                    <PanelHeader before={<PanelHeaderBack onClick={toBack} />}>
                      Создать аватары
                    </PanelHeader>
                    <CreateAvatar id={PanelTypes.MAIN} />
                  </Panel>
                </View>
                <View id={ViewTypes.PROFILE} activePanel={router.activePanel}>
                  <Panel id={PanelTypes.PROFILE}>
                    <PanelHeader before={<PanelHeaderBack onClick={toBack} />}>Профиль</PanelHeader>
                    <Group style={{ height: '700px' }}>
                      {fetchedUser && (
                        <>
                          <Group>
                            <Cell
                              before={
                                fetchedUser.photo_200 ? (
                                  <Avatar src={fetchedUser.photo_200} />
                                ) : null
                              }
                              subtitle={
                                fetchedUser.city && fetchedUser.city.title
                                  ? fetchedUser.city.title
                                  : ''
                              }
                            >
                              {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
                            </Cell>
                          </Group>
                          <Group description="Уведомления о завершении генерации аватара">
                            <SimpleCell
                              Component="label"
                              after={<Switch defaultChecked={isNotific} onChange={switchHandler} />}
                            >
                              Уведомления
                            </SimpleCell>
                          </Group>
                          {/* <Group mode="plain">
                            <CardGrid size="l">
                              <Card>
                                <Div>
                                  <Title level="2" style={{ marginBottom: 0 }}>
                                    15 токенов
                                  </Title>
                                </Div>
                                <Div style={{ paddingTop: 0 }}>
                                  <Text>
                                    Бесплатно токены начисляются ежедневно за вход в приложение
                                  </Text>
                                </Div>
                                <Div>
                                  <Button stretched mode="primary" size="m">
                                    Пополнить
                                  </Button>
                                </Div>
                              </Card>
                            </CardGrid>
                          </Group> */}
                        </>
                      )}
                    </Group>
                  </Panel>
                </View>
              </Epic>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default withRouter(App);
