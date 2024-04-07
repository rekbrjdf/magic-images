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
  PanelSpinner,
  Snackbar,
  ModalCardBase,
  Avatar,
  Card,
} from '@vkontakte/vkui';
import {
  Icon28AddOutline,
  Icon24Cancel,
  Icon24Error,
  Icon28ErrorCircleOutline,
} from '@vkontakte/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useRouterActions } from 'react-router-vkminiapps';
import Template from '../../components/Template/index';
import classes from './styles.module.scss';
// import { set } from '../../store';
import { ViewTypes, PanelTypes } from '../../routing/structure.ts';
import { uploadImages } from '../../redux/reducers/imagesSlice';

const param = window.location.search;

const MAX_FILE_SIZE_MB = 10;

const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/raw'];

const array = param.split('&');

const queryParams = array.map((item) => {
  const [key, value] = item.split('=');
  return { key, value };
});

const CreateAvatar = () => {
  const { toView, toPanel } = useRouterActions();
  const [overlay, setOverlay] = useState(false);
  const [valuePhoto, setValuePhoto] = useState();
  const [imageURI, setImageURI] = useState(null);
  const [selectedCellId, setSelectedCellId] = useState(1);
  const [snackbar, setSnackbar] = useState(null);
  const [previousFile, setPreviousFile] = useState(null);

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
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024); // Размер в мегабайтах

      if (fileSizeInMB > MAX_FILE_SIZE_MB) {
        // Файл слишком большой, выполните необходимые действия (покажите сообщение об ошибке, например)
        console.error('Файл слишком большой. Максимальный размер:', MAX_FILE_SIZE_MB, 'MB');

        if (snackbar) return;
        setSnackbar(
          <Snackbar
            before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
            onClose={() => setSnackbar(null)}
          >{`Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE_MB} MB`}</Snackbar>,
        );
        setImageURI(null);
      } else if (ALLOWED_IMAGE_FORMATS.includes(selectedFile.type)) {
        // Файл прошел проверку размера и формата
        if (selectedFile !== previousFile) {
          readURI(e);
          setValuePhoto(selectedFile);
          setPreviousFile(selectedFile);
        }
      } else {
        // Недопустимый формат изображения, выполните необходимые действия (покажите сообщение об ошибке, например)
        console.error('Недопустимый формат изображения. Разрешены только JPEG, PNG.');

        if (snackbar) return;
        setSnackbar(
          <Snackbar
            before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
            onClose={() => setSnackbar(null)}
          >
            Недопустимый формат изображения. Разрешены только JPEG, PNG.
          </Snackbar>,
        );
        setImageURI(null);
      }
    }
  };

  // const handleDelete = async (imageId) => {
  //   try {
  //     await dispatch(deleteImage(imageId));
  //     // После успешного удаления вызываем fetchImages() для обновления списка изображений
  //     dispatch(fetchImages());
  //   } catch (error) {
  //     console.error('Ошибка при удалении изображения:', error);
  //   }
  // };

  const uploadImage = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', valuePhoto);

      for (let i = 0; i < queryParams.length; i++) {
        formData.append(queryParams[i].key, queryParams[i].value);
      }

      dispatch(uploadImages({ formData, selectedCellId }));

      setSnackbar(true);
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error.message);

      if (error.message.includes('Failed to fetch')) {
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
            Произошла ошибка при попытке выполнить запрос. Пожалуйста, проверьте подключение к
            интернету и повторите попытку.
          </Snackbar>,
        );
      } else {
        setSnackbar(<span>Произошла ошибка при загрузке изображения.</span>);
      }
    } finally {
      setIsLoading(false);
      toView(ViewTypes.SERVICES);
      toPanel(PanelTypes.SERVICES);
    }
  };

  const getImage = async () => {
    const response = await fetch(`https://sonofleonid.ru/mini-app/${param}`);
    const result = await response.json();
    return result.url;
  };

  const getListImage = async () => {
    const response = await fetch(`https://sonofleonid.ru/mini-app/api/images${param}`);
    const result = await response.json();
    return result.url;
  };

  useEffect(() => {
    getImage();
    getListImage();
  }, []);

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
            {/* {snackbar && (
              <ModalCardBase
                onClose={() => setSnackbar(false)}
                dismissButtonMode="inside"
                style={{ width: 450, marginBottom: 20 }}
                header="Десктопная и планшетная версии с крестиком внутри"
                subheader="Сверху будет безопасный отступ до иконки"
              />
            )} */}
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
        {isLoading && (
          <Card className={classes.avatar__modal} mode="outline">
            <div className={classes.avatar__content}>
              <PanelSpinner style={{ height: 66 }}>
                Панель загружается, пожалуйста, подождите...
              </PanelSpinner>
              Приложению нужно время, чтобы сгенерировать изображение. Подождите около минуты{' '}
            </div>
          </Card>
        )}
      </Group>
      {snackbar}
    </div>
  );
};

export default CreateAvatar;
