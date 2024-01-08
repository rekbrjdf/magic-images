import React, { useState, useEffect } from 'react';

import {
  Div,
  Group,
  Button,
  Link,
  Header,
  HorizontalScroll,
  Image,
  Checkbox,
  FormLayout,
  FormLayoutGroup,
  FormItem,
  File,
  ScreenSpinner,
  Snackbar,
  Avatar,
} from '@vkontakte/vkui';
import { Icon28AddOutline, Icon24Cancel, Icon24Error } from '@vkontakte/icons';
import { useDispatch, useSelector } from 'react-redux';
import Template from '../../components/Template/index';
import classes from './styles.module.scss';
import { set } from '../../store';

// const apiUrl = "https://sonofleonid.ru/mini-app/api/upload";
// const param =
//   'vk_access_token_settings=&vk_app_id=51777387&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_ts=1701599146&vk_user_id=36039796&sign=zIJyvuNPxO1RNmilIvpihsgCqtHzb2vaEdokPdQAnt0';
const param = window.location.search;

const array = param.split('&');
const queryParams = array.map((item) => {
  const [key, value] = item.split('=');
  return { key, value };
});

const CreateAvatar = () => {
  const [overlay, setOverlay] = useState(false);
  const [valuePhoto, setValuePhoto] = useState();
  const [imageURI, setImageURI] = useState(null);
  const [selectedCellId, setSelectedCellId] = useState(1);
  const [snackbar, setSnackbar] = useState(null);

  const mainStorage = useSelector((state) => state.main);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const readURI = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageURI(ev.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const deleteImage = () => {
    setImageURI(null);
  };

  const onFileUpload = (e) => {
    readURI(e);
    console.log(e.target, 'event.target.result');
    setValuePhoto(e.target.files[0]);
  };

  const uploadImage = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', valuePhoto);

    for (let i = 0; i < queryParams.length; i++) {
      formData.append(queryParams[i].key, queryParams[i].value);
    }

    try {
      const response = await fetch(
        `https://sonofleonid.ru/mini-app/api/upload${param}&prompt_id=${selectedCellId}`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (response.status === 413) {
        setSnackbar(
          <Snackbar
            layout="vertical"
            onClose={() => setSnackbar(null)}
            before={
              <Avatar size={24} style={{ backgroundColor: 'red' }}>
                <Icon24Error fill="#fff" width={14} height={14} />
              </Avatar>
            }
            duration={900}
          >
            Проблема с получением данных из Storage
          </Snackbar>,
        );
        throw new Error('Ошибка: Превышен максимальный размер файла.');
      }

      const result = await response.json();
      console.log(result, 'result33333333333');
      return result.url;
    } catch (error) {
      setSnackbar(
        <Snackbar
          layout="vertical"
          onClose={() => setSnackbar(null)}
          before={
            <Avatar size={24} style={{ backgroundColor: 'red' }}>
              <Icon24Error fill="#fff" width={14} height={14} />
            </Avatar>
          }
          duration={900}
        >
          Проблема с получением данных из Storage
        </Snackbar>,
      );
      console.log('Произошла ошибка при загрузке изображения:', error.message);
    }
    return '';
  };

  const getImage = async () => {
    const response = await fetch(`https://sonofleonid.ru/mini-app/${param}`);
    const result = await response.json();
    console.log(result, 'result1211111111112');
    return result.url;
  };

  const getListImage = async () => {
    const response = await fetch(`https://sonofleonid.ru/mini-app/api/images${param}`);
    const result = await response.json();
    console.log(result, 'getListImage');
    return result.url;
  };

  useEffect(() => {
    getImage();
    getListImage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const imageSrc = await uploadImage(valuePhoto);

    const response = await fetch(
      'https://sonofleonid.ru/mini-app/api/upload?vk_access_token_settings=&vk_app_id=51780597&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_ts=1700580539&vk_user_id=155778911&sign=fdsfsdfsdgsdfhfhgdfhdfhdfhdfh',
      {
        method: 'POST',
        // headers: {
        //   Authorization: `Bearer ${mainStorage.accountToken}`,
        //   'Content-Type': 'application/json',
        // },
        body: JSON.stringify({
          image: imageSrc,
          owner_id: mainStorage.user.id,
        }),
      },
    );

    const result = await response.json();

    if (result.event_id) {
      dispatch(
        set({
          profilePanelEventId: result.event_id,
        }),
      );
      // router.toPanel(PanelTypes.PROFILE_NEW_TICKET);
    }

    // router.toPanel(PanelTypes.PROFILE_HOME);
    setIsLoading(false);
  };

  return (
    <div className={classes.avatar}>
      <Group header={<Header size="large">Выберите шаблон</Header>}>
        <HorizontalScroll>
          <div style={{ display: 'flex' }}>
            <Template onSelect={(id) => setSelectedCellId(id)} />
          </div>
        </HorizontalScroll>
      </Group>
      <Group header={<Header size="large">Выберите фото</Header>}>
        <Group>
          <FormLayout onSubmit={uploadImage}>
            {imageURI !== null && (
              <FormItem className={classes['avatar__wrapper-img']}>
                <Div className={classes.avatar__close} onClick={deleteImage}>
                  <Image withBorder={false} size={52}>
                    <Icon24Cancel />
                  </Image>
                </Div>

                <img
                  className={classes.avatar__img}
                  width={200}
                  src={imageURI}
                  alt="Выбранное изображение"
                />
              </FormItem>
            )}
            <FormLayoutGroup mode="horizontal">
              <FormItem>
                <File
                  className={classes.avatar__file}
                  onChange={onFileUpload}
                  before={
                    <Image withBorder={false} size={72}>
                      <Icon28AddOutline />
                    </Image>
                  }
                  size="m"
                >
                  {imageURI === null
                    ? 'Выбрать селфи из медиатеки устройства'
                    : 'Выбрать другое фото'}
                </File>
              </FormItem>
            </FormLayoutGroup>
            {/* <FormItem>
              <Checkbox checked={overlay} onChange={(e) => setOverlay(e.target.checked)}>
                Я принимаю пользовательское соглашение
              </Checkbox>
            </FormItem> */}
            <FormItem>
              <Button stretched type="submit" mode="secondary" disabled={!imageURI} size="m">
                Сгенерировать аватар
              </Button>
            </FormItem>
          </FormLayout>
        </Group>
        {isLoading && <ScreenSpinner />}
      </Group>
    </div>
  );
};

export default CreateAvatar;
