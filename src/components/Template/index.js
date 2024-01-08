import React, { useState } from 'react';
import { HorizontalCell, Image, useAppearance } from '@vkontakte/vkui';

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

const Template = ({ onSelect }) => {
  const [selectedId, setSelectedId] = useState(1);

  console.log(selectedId, 'selectedId');
  const handleClick = (id) => {
    setSelectedId(id === selectedId ? null : id);
    onSelect(id);
  };

  const appearance = useAppearance();
  const colorForCell = appearance === 'dark' ? '#333333' : '#f0f2f5';
  console.log(appearance, 'appearance');

  return items.map(({ id, title, price, image }) => (
    <HorizontalCell
      key={id}
      onClick={() => handleClick(id)}
      size="l"
      header={title}
      subtitle={`${price} токенов`}
      style={{
        borderRadius: '8px',
        backgroundColor: selectedId === id ? colorForCell : 'transparent',
      }}
    >
      <Image size={128} src={image} />
    </HorizontalCell>
  ));
};

export default Template;
