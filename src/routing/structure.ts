import { IStructure } from 'react-router-vkminiapps';

// для удобства можно использовать enum typescript
export enum ViewTypes {
  MAIN = 'MAIN',
  PROFILE = 'PROFILE',
  SERVICES = 'SERVICES',
}

export enum PanelTypes {
  SERVICES = 'SERVICES',
  MAIN = 'MAIN',
  PROFILE = 'PROFILE',
}

const structure: IStructure = [
  {
    id: ViewTypes.MAIN,
    hash: 'main',
    panels: [
      {
        id: PanelTypes.MAIN,
        hash: '',
      },
    ],
  },
  {
    id: ViewTypes.SERVICES,
    hash: 'services',
    panels: [
      {
        id: PanelTypes.SERVICES,
        hash: '',
      },
    ],
  },
  {
    id: ViewTypes.PROFILE,
    hash: 'profile',
    panels: [
      {
        id: PanelTypes.PROFILE,
        hash: '',
      },
    ],
  },
];

export default structure;
