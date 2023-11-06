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
  SimpleCell,
  Switch,
  CardGrid,
  Card,
  Title,
  Text,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {
  // Icon28HomeOutline,
  Icon28ServicesOutline,
  Icon28MessageOutline,
  Icon28UserCircleOutline,
  Icon24Error,
} from '@vkontakte/icons';
import Gallery from './components/Gallery/index';
import CreateAvatar from './panels/CreateAvatar/index';
import CustomTabbar from './components/CustomTabbar';
import ShowSlides from './services/OnboardingService';
// import imgSlide1 from './res/image/info-slider1.png';
// import Home from './panels/Home';
// import Persik from './panels/Persik';

const ROUTES = {
  HOME: 'home',
  INTRO: 'intro',
};

const STORAGE_KEYS = {
  STATE: 'state',
  STATUS: 'viewStatus',
};

const App = () => {
  const [activePanel, setActivePanel] = useState('home');
  const [fetchedUser, setUser] = useState(null);
  console.log(activePanel, 'activePanel');
  const [snackbar, setSnackbar] = useState(null);
  console.log(snackbar, 'snackbar');

  const [fetchedState, setFetchedState] = useState(null);
  console.log(fetchedState, 'fetchedState');

  const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

  const [activeStory, setActiveStory] = useState('profile');
  const onStoryChange = (e) => setActiveStory(e.currentTarget.dataset.story);

  const platform = usePlatform();
  const { viewWidth } = useAdaptivityConditionalRender();
  const activeStoryStyles = {
    backgroundColor: 'var(--vkui--color_background_secondary)',
    borderRadius: 8,
  };
  const hasHeader = platform !== Platform.VKCOM;

  const onboardingShowedKey = 'onboarding_showed';

  async function isShowedSlidesSheet() {
    const data = await bridge.send('VKWebAppStorageGet', {
      keys: [onboardingShowedKey],
    });

    const isShowed = data.keys.some(
      ({ key, value }) => key === onboardingShowedKey && value === '1',
    );

    return isShowed;
  }

  useEffect(() => {
    bridge.send('VKWebAppInit');

    bridge.isWebView();
    isShowedSlidesSheet().then((isShowed) => {
      if (!isShowed) {
        console.log('Пользователь еще не видел онбординг');
        ShowSlides();
      }
    });
  }, []);

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme');
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
        document.body.attributes.setNamedItem(schemeAttribute);
      }
    });
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
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
                  setActivePanel(ROUTES.HOME);
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

  // const go = (e) => {
  //   setActivePanel(e.currentTarget.dataset.to);
  // };

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
                      disabled={activeStory === 'services'}
                      style={activeStory === 'services' ? activeStoryStyles : undefined}
                      data-story="services"
                      onClick={onStoryChange}
                      before={<Icon28ServicesOutline />}
                    >
                      Мои аватары
                    </Cell>
                    <Cell
                      disabled={activeStory === 'main'}
                      style={activeStory === 'main' ? activeStoryStyles : undefined}
                      data-story="main"
                      onClick={onStoryChange}
                      before={<Icon28MessageOutline />}
                    >
                      Создать аватар
                    </Cell>

                    <Cell
                      disabled={activeStory === 'profile'}
                      style={activeStory === 'profile' ? activeStoryStyles : undefined}
                      data-story="profile"
                      onClick={onStoryChange}
                      before={<Icon28UserCircleOutline />}
                    >
                      Профиль
                    </Cell>
                  </Group>
                </Panel>
              </SplitCol>
            )}

            <SplitCol width="100%" maxWidth="560px" stretchedOnMobile autoSpaced>
              <Epic
                activeStory={activeStory}
                tabbar={
                  viewWidth.tabletMinus && (
                    <CustomTabbar activeStory={activeStory} onStoryChange={onStoryChange} />
                  )
                }
              >
                <View id="services" activePanel="services">
                  <Panel id="services">
                    <PanelHeader before={<PanelHeaderBack />}>Мои аватары</PanelHeader>
                    <Group style={{ height: '600px' }}>
                      <Gallery />
                    </Group>
                  </Panel>
                </View>
                <View id="main" activePanel="main">
                  <CreateAvatar id="main" />
                </View>

                <View id="profile" activePanel="profile">
                  <Panel id="profile">
                    <PanelHeader before={<PanelHeaderBack />}>Профиль</PanelHeader>
                    <Group style={{ height: '600px' }}>
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
                            <SimpleCell Component="label" after={<Switch defaultChecked />}>
                              Уведомления
                            </SimpleCell>
                          </Group>
                          <Group mode="plain">
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
                          </Group>
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

export default App;
