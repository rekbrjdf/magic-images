import React from 'react';
import { Counter, TabbarItem, Tabbar, Badge } from '@vkontakte/vkui';
import { useRouterActions } from 'react-router-vkminiapps';
import {
  Icon28HomeOutline,
  Icon28ServicesOutline,
  Icon28UserCircleOutline,
} from '@vkontakte/icons';
import { ViewTypes } from '../routing/structure.ts';

const CustomTabbar = ({ router }) => {
  const { toView } = useRouterActions();
  return (
    <Tabbar>
      <TabbarItem
        onClick={() => toView(ViewTypes.MAIN)}
        selected={router.activeView === ViewTypes.MAIN}
        data-story="main"
        text="Создать аватар"
      >
        <Icon28HomeOutline />
      </TabbarItem>
      <TabbarItem
        onClick={() => toView(ViewTypes.SERVICES)}
        selected={router.activeView === ViewTypes.SERVICES}
        data-story="services"
        text="Мои аватары"
        indicator={
          <Counter size="s" mode="prominent">
            3
          </Counter>
        }
      >
        <Icon28ServicesOutline />
      </TabbarItem>

      <TabbarItem
        onClick={() => toView(ViewTypes.PROFILE)}
        selected={router.activeView === ViewTypes.PROFILE}
        data-story="profile"
        indicator={<Badge mode="prominent" />}
        text="Профиль"
      >
        <Icon28UserCircleOutline />
      </TabbarItem>
    </Tabbar>
  );
};

export default CustomTabbar;
