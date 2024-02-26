import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Div, ButtonGroup, Button, IconButton, PanelSpinner, Spinner } from '@vkontakte/vkui';
import { Icon16Delete } from '@vkontakte/icons';
import { fetchImages, deleteImage } from '../../redux/reducers/imagesSlice'; // Подставьте путь к вашим actions
import classes from './styles.module.scss';

const param = window.location.search;

const Gallery = () => {
  const dispatch = useDispatch();
  const { images, loading } = useSelector((state) => state.images);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchImages()); // Запрос на загрузку изображений при монтировании компонента
  }, [dispatch]);

  console.log(images, 'images');

  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(`https://sonofleonid.ru/mini-app/static/${fileName}${param}`);
      const blob = await response.blob();

      // Создаем ссылку для скачивания
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName; // Имя файла, которое будет использоваться при скачивании

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Ошибка при скачивании изображения:', error);
    }
  };

  const handleDelete = async (imageId) => {
    dispatch(deleteImage(imageId)); // Удаление изображения через Redux action
  };

  const handleImageLoad = () => {
    setImageLoaded(true); // Устанавливаем состояние загрузки картинки в true после ее загрузки
  };

  if (loading) {
    return <PanelSpinner size="large" className={classes.gallery__spinner} state="cancelable" />;
  }

  return (
    <div className={classes.gallery}>
      {images.map(({ id, file }) => {
        const cart = `https://sonofleonid.ru/mini-app/static/${file}${param}`;

        return (
          <Div key={id} style={{ width: '350px' }} className={classes.gallery__item}>
            <div
              style={{
                width: '350px',
                height: '350px',
                backgroundImage: `url('https://sonofleonid.ru/mini-app/static/${file}${param}')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                borderRadius: '8px',
                backgroundColor: 'transparent',
              }}
            />
            {/* <Div style={{ width: '100%', height: 'auto' }}>

              {imageLoaded ? ( // Показываем картинку только после ее полной загрузки
                <img
                  style={{ width: '350px', height: '100%', borderRadius: '8px' }}
                  src={cart}
                  alt={`Image ${id}`}
                  onLoad={handleImageLoad}
                />
              ) : (
                <Spinner size="large" style={{ margin: '20px 0' }} />
              )}
            </Div> */}

            <Div style={{ width: '100%' }}>
              <ButtonGroup mode="horizontal" gap="m" stretched>
                <Button size="l" onClick={() => handleDownload(file)} appearance="accent" stretched>
                  Скачать
                </Button>

                <IconButton onClick={() => handleDelete(id)}>
                  <Icon16Delete />
                </IconButton>
              </ButtonGroup>
            </Div>
          </Div>
        );
      })}
    </div>
  );
};

export default Gallery;
