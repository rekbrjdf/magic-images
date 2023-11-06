import React from 'react';
// import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Counter, TabbarItem, Tabbar, Badge } from '@vkontakte/vkui';
import {
  Icon28HomeOutline,
  Icon28ServicesOutline,
  Icon28UserCircleOutline,
} from '@vkontakte/icons';

const CustomTabbar = ({ activeStory, onStoryChange }) => (
  // className={viewWidth.tabletMinus.className}
  <Tabbar>
    <TabbarItem
      onClick={onStoryChange}
      selected={activeStory === 'main'}
      data-story="main"
      text="Создать аватар"
    >
      <Icon28HomeOutline />
    </TabbarItem>
    <TabbarItem
      onClick={onStoryChange}
      selected={activeStory === 'services'}
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
      onClick={onStoryChange}
      selected={activeStory === 'profile'}
      data-story="profile"
      indicator={<Badge mode="prominent" />}
      text="Профиль"
    >
      <Icon28UserCircleOutline />
    </TabbarItem>
  </Tabbar>
);
export default CustomTabbar;
