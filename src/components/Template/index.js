import React, { useState } from 'react';
import { HorizontalCell, Image, useAppearance } from '@vkontakte/vkui';
import imgNaruto from '../../res/image/logo_naruto.png';
import imgHh from '../../res/image/logo_hh.png';
import imgOp from '../../res/image/logo_op.png';
import imgArcane from '../../res/image/logo_arcane.png';
import imgCyberpunk from '../../res/image/logo_cyberpunk.png';

const items = [
  {
    id: 1,
    title: 'Наруто',
    price: 4,
    image: imgNaruto,
  },
  {
    id: 2,
    title: 'Hunter × Hunter',
    price: 22,
    image: imgHh,
  },
  {
    id: 3,
    title: 'One Piece',
    price: 64,
    image: imgOp,
  },
  {
    id: 4,
    title: 'Аркейн',
    price: 64,
    image: imgArcane,
  },
  {
    id: 5,
    title: 'Киберпанк',
    price: 64,
    image: imgCyberpunk,
  },
];

const Template = ({ onSelect }) => {
  const [selectedId, setSelectedId] = useState(1);

  const handleClick = (id) => {
    setSelectedId(id === selectedId ? null : id);
    onSelect(id);
  };

  const appearance = useAppearance();
  const colorForCell = appearance === 'dark' ? '#333333' : '#f0f2f5';

  return items.map(({ id, title, price, image }) => (
    <HorizontalCell
      key={id}
      onClick={() => handleClick(id)}
      size="l"
      header={title}
      // subtitle={`${price} токенов`}
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
