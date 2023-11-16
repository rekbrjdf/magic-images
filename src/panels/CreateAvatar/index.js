import React, { useState } from 'react';

import {
  Div,
  Group,
  Panel,
  Button,
  PanelHeader,
  Link,
  PanelHeaderBack,
  Header,
  HorizontalScroll,
  Image,
  Checkbox,
  FormLayout,
  FormLayoutGroup,
  FormItem,
  File,
  ScreenSpinner,
} from '@vkontakte/vkui';
import { Icon28AddOutline, Icon24Cancel } from '@vkontakte/icons';
import { useDispatch, useSelector } from 'react-redux';
import Template from '../../components/Template/index';
import classes from './styles.module.scss';
import { set } from '../../store';

const CreateAvatar = ({ id }) => {
  const [overlay, setOverlay] = useState(false);
  const [valuePhoto, setValuePhoto] = useState();
  const [imageURI, setImageURI] = useState(null);

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

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('https://pics.seizure.icu/api/upload.php', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    return result.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!valueName || !valueLocation || !valueTime || !valueDescription) {
    //   setError("Заполните все поля");
    //   return;
    // }

    setIsLoading(true);
    const imageSrc = await uploadImage(valuePhoto);

    const response = await fetch('https://vknft.seizure.icu/create/event', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mainStorage.accountToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageSrc,
        owner_id: mainStorage.user.id,
      }),
    });

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
    <Panel id={id} className={classes.avatar}>
      <PanelHeader before={<PanelHeaderBack />}>Создать аватары</PanelHeader>
      <Group
        header={
          <Header size="large" aside={<Link>Показать все</Link>}>
            Выберите шаблон
          </Header>
        }
      >
        <HorizontalScroll>
          <div style={{ display: 'flex' }}>
            <Template />
          </div>
        </HorizontalScroll>
      </Group>
      <Group header={<Header size="large">Выберите фото</Header>}>
        <Group>
          <FormLayout onSubmit={handleSubmit}>
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
            <FormItem>
              <Checkbox checked={overlay} onChange={(e) => setOverlay(e.target.checked)}>
                Я принимаю пользовательское соглашение
              </Checkbox>
            </FormItem>
            <FormItem>
              <Button stretched type="submit" mode="secondary" disabled={!overlay} size="m">
                Сгенерировать аватар (10 токенов)
              </Button>
            </FormItem>
          </FormLayout>
        </Group>
        {isLoading && <ScreenSpinner />}
      </Group>
    </Panel>
  );
};

export default CreateAvatar;
