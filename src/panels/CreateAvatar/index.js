import React, { useState } from 'react';

import {
  Div,
  Group,
  Panel,
  Button,
  CellButton,
  PanelHeader,
  Link,
  PanelHeaderBack,
  Header,
  HorizontalScroll,
  Image,
  Checkbox,
} from '@vkontakte/vkui';
import { Icon28AddOutline } from '@vkontakte/icons';
import Template from '../../components/Template/index';
import classes from './styles.module.scss';

const CreateAvatar = ({ id }) => {
  const [overlay, setOverlay] = useState(false);
  return (
    <Panel id={id} className={classes.avatar}>
      <PanelHeader before={<PanelHeaderBack />}>Создать аватары</PanelHeader>
      {/* <Group style={{ height: '600px' }}>
    <Placeholder icon={<Icon28HomeOutline width={56} height={56} />} />
  </Group> */}
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
        <CellButton
          before={
            <Image withBorder={false} size={72}>
              <Icon28AddOutline />
            </Image>
          }
        >
          Выбрать селфи из медиатеки устройства
        </CellButton>
        <Checkbox checked={overlay} onChange={(e) => setOverlay(e.target.checked)}>
          Я принимаю пользовательское соглашение
        </Checkbox>
        <Div>
          <Button stretched mode="secondary" disabled={!overlay} size="m">
            Сгенерировать аватар (10 токенов)
          </Button>
        </Div>
      </Group>
    </Panel>
  );
};

export default CreateAvatar;
