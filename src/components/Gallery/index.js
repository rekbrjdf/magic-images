/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Div, ButtonGroup, Button, IconButton, PanelSpinner, Spinner } from '@vkontakte/vkui';
import { Icon16Delete } from '@vkontakte/icons';
import { fetchImages, deleteImage } from '../../redux/reducers/imagesSlice'; // Подставьте путь к вашим actions
import classes from './styles.module.scss';

const param = window.location.search;

const Gallery = () => {
  const dispatch = useDispatch();
  const { images, loading, data, taskStatus } = useSelector((state) => state.images);
  // const [imageStatus, setImageStatus] = useState({}); // Статус задачи для каждого изображения

  console.log(data, 'data');
  console.log(images, 'images');

  console.log(taskStatus, 'taskStatus');

  // Запрос на загрузку изображений при монтировании компонента
  useEffect(() => {
    dispatch(fetchImages());
  }, [dispatch]);

  // Функция для загрузки изображения
  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(`https://sonofleonid.ru/mini-app/static/${fileName}${param}`);
      const blob = await response.blob();

      // Создаем ссылку для скачивания
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Ошибка при скачивании изображения:', error);
    }
  };

  // Функция для удаления изображения
  const handleDelete = async (imageId) => {
    try {
      await dispatch(deleteImage(imageId));
      // После успешного удаления вызываем fetchImages() для обновления списка изображений
      dispatch(fetchImages());
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
    }
  };

  // Отображение
  if (loading) {
    return <PanelSpinner size="large" className={classes.gallery__spinner} state="cancelable" />;
  }

  return (
    <div className={classes.gallery}>
      {images.length > 1 ? (
        images.map(({ id, file, is_init_img }) => {
          const imageUrl = `https://sonofleonid.ru/mini-app/static/${file}${param}`;
          // const status = imageStatus[id];
          // console.log(status, 'status component');
          return (
            <Div key={id} style={{ maxWidth: '350px' }} className={classes.gallery__item}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '350px',
                  height: '350px',
                  backgroundImage: `url('${imageUrl}')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  filter: is_init_img ? 'blur(8px)' : 'none',
                }}
              />
              {!is_init_img && (
                <Div style={{ width: 'auto', paddingLeft: '0', paddingRight: '0' }}>
                  <ButtonGroup mode="horizontal" gap="m" stretched>
                    <Button
                      size="l"
                      onClick={() => handleDownload(file)}
                      appearance="accent"
                      stretched
                    >
                      Скачать
                    </Button>
                    <IconButton onClick={() => handleDelete(id)}>
                      <Icon16Delete />
                    </IconButton>
                  </ButtonGroup>
                </Div>
              )}
              {/* Логика отображения статуса */}
              {/* {status === 'success' && (
                <Div style={{ width: 'auto', color: 'red' }} className={classes.gallery__status}>
                  Статус: Выполнено
                </Div>
              )}
              {status === 'error' && (
                <Div style={{ width: 'auto', color: 'red' }} className={classes.gallery__status}>
                  Статус: Ошибка
                  <IconButton onClick={() => handleDelete(id)}>
                    <Icon16Delete />
                  </IconButton>
                </Div>
              )}
              {status === 'pending' && (
                <Div style={{ width: 'auto', color: 'red' }} className={classes.gallery__status}>
                  Статус: Выполняется...
                </Div>
              )} */}
            </Div>
          );
        })
      ) : (
        <Div>У вас пока нет загруженных изображений</Div>
      )}
    </div>
  );
};

export default Gallery;
