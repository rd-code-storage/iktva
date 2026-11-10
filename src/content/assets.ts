export type AssetCategory = 'script' | 'reference' | 'render' | 'document' | 'model';

export interface AssetFile {
  path: string;
  label: string;
  size?: string;
}

export interface Asset {
  id: string;
  title: string;
  category: AssetCategory;
  author: string;
  date: string;
  description: string;
  files: AssetFile[];
  thumbnail?: string;
}

export const categoryLabels: Record<AssetCategory, string> = {
  script: 'Scripts',
  reference: 'References',
  render: 'Renders',
  document: 'Documents',
  model: '3D Models',
};

export const assets: Asset[] = [
  {
    id: 'hall1-mockup',
    title: 'Hall 1 Mock-up Model',
    category: 'model',
    author: 'Alex Gorcik',
    date: '2026-11-10',
    description:
      'Scale mock-up of Dharan Expo Hall 1 with adjustable screen length. Used for forced perspective testing and sweet-spot validation.',
    files: [],
    thumbnail: undefined,
  },
  {
    id: 'masterchef-ref',
    title: 'MasterChef Curved Screen Reference',
    category: 'reference',
    author: 'Alex Gorcik',
    date: '2026-11-05',
    description:
      'Reference video showing the curved-screen forced perspective setup used on MasterChef. At 0:45, shows the distorted flat export that corrects when projected.',
    files: [
      { path: 'https://www.youtube.com/watch?v=-fpobu4hv0o', label: 'YouTube link' },
    ],
  },
  {
    id: 'anamorphic-thread',
    title: 'Blender Anamorphic Rendering Thread',
    category: 'reference',
    author: 'Alex Gorcik',
    date: '2026-11-05',
    description:
      'Blender Artists forum thread on rendering 3D anamorphic content for curved screens. Covers camera setup and UV mapping approach.',
    files: [
      {
        path: 'https://blenderartists.org/t/how-to-render-3d-anamorphic-movie-on-curved-screen-or-fake-3d-image/1300925/3',
        label: 'Forum thread',
      },
    ],
  },
  {
    id: 'script-v03',
    title: 'Script v03',
    category: 'document',
    author: 'James Barry',
    date: '2026-11-09',
    description: 'Latest script draft, updated based on the messaging document.',
    files: [
      {
        path: 'https://docs.google.com/document/d/1ayVlX54fqgrrDMdFZ6phFeC24J_4OrpqNm8iCgoWXkE/edit',
        label: 'Google Doc',
      },
    ],
  },
];
