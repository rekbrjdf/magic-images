import React, { useState } from 'react';

import {
  Div,
  // Group,
  // Panel,
  // Header,
  ButtonGroup,
  Button,
  // SplitLayout,
  // SplitCol,
  // View,
  // CellButton,
  PanelSpinner,
  // ScreenSpinner,
} from '@vkontakte/vkui';
import cn from 'classnames';
import image1 from '../../res/image/gallery.jpg';
import classes from './styles.module.scss';

const items = [
  {
    id: 1,
    done: true,
    image: image1,
  },
  {
    id: 2,
    done: false,
    image: image1,
  },
  {
    id: 3,
    done: true,
    image: image1,
  },
  {
    id: 4,
    done: false,
    image: image1,
  },
  {
    id: 5,
    done: true,
    image: image1,
  },
];

const Gallery = () => {
  const [popout, setPopout] = useState(true);

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

  const item = items.map(({ id, image, done }) => (
    <Div key={id} className={classes.gallery__item}>
      <Div style={{ width: '100%', height: 'auto' }}>
        <img style={{ width: '350px', height: '100%' }} src={image} />
        {/* <Spinner size="large" style={{ margin: '20px 0' }} /> */}
      </Div>
      <Div>
        <ButtonGroup mode="horizontal" gap="m" stretched>
          <Button size="l" appearance="accent" stretched>
            Скачать
          </Button>
          <Button size="l" appearance="accent" stretched>
            Еще
          </Button>
        </ButtonGroup>
      </Div>
      {done && (
        <Div className={cn(classes.gallery__wrapper, { [classes.gallery__show]: !popout })}>
          <PanelSpinner
            size="large"
            className={classes.gallery__spinner}
            state="cancelable"
            onClick={() => setPopout(!done)}
          />
        </Div>
      )}

      {/* {spinnerMain} */}
    </Div>
  ));

  return <div className={classes.gallery}>{item}</div>;
};

export default Gallery;
