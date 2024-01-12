import React, { useState, useEffect } from 'react';

import {
  Div,
  // Group,
  // Panel,
  // Header,
  ButtonGroup,
  Button,
  IconButton,
  // SplitLayout,
  // SplitCol,
  // View,
  // CellButton,
  PanelSpinner,
  // ScreenSpinner,
} from '@vkontakte/vkui';
import { Icon16Delete } from '@vkontakte/icons';
import cn from 'classnames';
import image1 from '../../res/image/gallery.jpg';
import classes from './styles.module.scss';

const param = window.location.search;

const Gallery = () => {
  const [popout, setPopout] = useState(true);
  const [images, setImages] = useState([]);

  const getListImage = async () => {
    const response = await fetch(`https://sonofleonid.ru/mini-app/api/images${param}`);
    const result = await response.json();
    setImages(result);
    console.log(result, 'getListImage11111111111111');
    return result.url;
  };

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

  // const getPhoto = async () => {
  //   const photo = '2f9fc7e0-91b1-42e5-9f04-ce5998af294a.png';
  //   const response = await fetch(
  //     `https://sonofleonid.ru/mini-app/static/2f9fc7e0-91b1-42e5-9f04-ce5998af294a.png${param}`,
  //   );
  //   const result = await response.json();

  //   console.log(result, 'getPhotogetPhotogetPhoto');
  //   return result.url;
  // };

  const handleDelete = async (imageId) => {
    try {
      const response = await fetch(
        `https://sonofleonid.ru/mini-app/api/delete${param}&image_id=${imageId}`,
        {
          method: 'DELETE',
        },
      );
      const result = await response.json();
      console.log(result);
      if (result.message === 'Успешное удаление') {
        // Фильтруем список изображений, убирая удаленное изображение по его ID
        const updatedImages = images.filter((img) => img.id !== imageId);
        setImages(updatedImages);
      }
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
    }
  };

  useEffect(() => {
    getListImage();
    // getPhoto();
  }, []);
  // console.log(images, 'images');

  // const setCancelableScreenSpinner = () => {
  //   setPopout(<ScreenSpinner state="cancelable" onClick={clearPopout} />);
  // };

  // const spinnerMain = (
  //   <SplitLayout popout={popout} aria-live="polite" aria-busy={!!popout}>
  //     <SplitCol>
  //       <View activePanel="spinner">
  //         <Panel id="spinner">
  //           <Group>
  //             <CellButton onClick={setCancelableScreenSpinner}>
  //               Запустить отменяемый процесс
  //             </CellButton>
  //           </Group>
  //         </Panel>
  //       </View>
  //     </SplitCol>
  //   </SplitLayout>
  // );

  const item = images.reverse().map(({ id, file }) => (
    <Div key={id} style={{ width: '350px' }} className={classes.gallery__item}>
      <Div style={{ width: '100%', height: 'auto' }}>
        <img
          style={{ width: '350px', height: '100%', borderRadius: '8px' }}
          src={`https://sonofleonid.ru/mini-app/static/${file}${param}`}
        />
        {/* <Spinner size="large" style={{ margin: '20px 0' }} /> */}
      </Div>
      <Div style={{ width: '100%' }}>
        <ButtonGroup mode="horizontal" gap="m" stretched>
          <Button size="l" onClick={() => handleDownload(file)} appearance="accent" stretched>
            Скачать
          </Button>

          <IconButton onClick={() => handleDelete(id)}>
            <Icon16Delete />
          </IconButton>
          {/* <Button size="l" appearance="accent" stretched>
            Еще
          </Button> */}
        </ButtonGroup>
      </Div>
      {/* {done && (
        <Div className={cn(classes.gallery__wrapper, { [classes.gallery__show]: !popout })}>
          <PanelSpinner
            size="large"
            className={classes.gallery__spinner}
            state="cancelable"
            onClick={() => setPopout(!done)}
          />
        </Div>
      )} */}

      {/* {spinnerMain} */}
    </Div>
  ));

  return <div className={classes.gallery}>{item}</div>;
};

export default Gallery;
