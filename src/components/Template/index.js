import React from 'react';

import { HorizontalCell, Image } from '@vkontakte/vkui';

const items = [
  {
    id: 1,
    title: 'Команда <3',
    price: 4,
    image: 'https://sun9-33.userapi.com/ODk8khvW97c6aSx_MxHXhok5byDCsHEoU-3BwA/sO-lGf_NjN4.jpg',
  },
  {
    id: 2,
    title: 'Зингер',
    price: 22,
    image: 'https://sun9-60.userapi.com/bjwt581hETPAp4oY92bDcRvMymyfCaEsnojaUA/_KWQfS-MAd4.jpg',
  },
  {
    id: 3,
    title: 'Медиагалерея ВКонтакте',
    price: 64,
    image: 'https://sun9-26.userapi.com/YZ5-1A6cVgL7g1opJGQIWg1Bl5ynfPi8p41SkQ/IYIUDqGkkBE.jpg',
  },
  {
    id: 4,
    title: 'Медиагалерея ВКонтакте',
    price: 64,
    image: 'https://sun9-26.userapi.com/YZ5-1A6cVgL7g1opJGQIWg1Bl5ynfPi8p41SkQ/IYIUDqGkkBE.jpg',
  },
  {
    id: 5,
    title: 'Медиагалерея ВКонтакте',
    price: 64,
    image: 'https://sun9-26.userapi.com/YZ5-1A6cVgL7g1opJGQIWg1Bl5ynfPi8p41SkQ/IYIUDqGkkBE.jpg',
  },
];

const Template = () =>
  items.map(({ id, title, price, image }) => (
    <HorizontalCell key={id} size="l" header={title} subtitle={`${price} токенов`}>
      <Image size={128} src={image} />
    </HorizontalCell>
  ));

export default Template;
