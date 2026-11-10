export interface TeamMember {
  name: string;
  role: string;
}

export interface Update {
  date: string;
  title: string;
  description: string;
}

export interface ScreenSpec {
  label: string;
  value: string;
}

export interface ProjectInfo {
  title: string;
  code: string;
  client: string;
  venue: string;
  producer: string;
  status: string;
  description: string;
  team: TeamMember[];
  updates: Update[];
  screenSpecs: ScreenSpec[];
  links: { label: string; url: string }[];
}

export const project: ProjectInfo = {
  title: 'Off the Scale',
  code: '2491',
  client: 'Aramco (IKTVA 2027)',
  venue: 'Dharan Expo, Hall 1',
  producer: 'RD Content',
  status: 'Pre-Production',
  description:
    'Immersive event film with forced-perspective animation across large-format screens and laser integration for the IKTVA 2027 conference.',
  team: [
    { name: 'Ryan', role: 'Director' },
    { name: 'Benjamin Raymond', role: 'Producer' },
    { name: 'James Barry', role: 'Writer' },
    { name: 'Alex Gorcik', role: '3D / Animation' },
    { name: 'Bella Servidio', role: 'Production Coordinator' },
    { name: 'Eddie Sternberg', role: 'Supplier Sourcing' },
    { name: 'Will Jarvis', role: 'Creative Producer' },
    { name: 'Angus Steele', role: 'Team' },
    { name: 'Kerr', role: 'Team' },
  ],
  updates: [
    {
      date: '2026-11-10',
      title: 'Project repo created',
      description: 'Knowledge base and code repository set up for the animation team.',
    },
    {
      date: '2026-11-10',
      title: 'Forced perspective mock-up',
      description:
        'Alex built a mock-up model of Hall 1 with screen specs from previous IKTVA screens. Screen length is adjustable. Working on UV pass and screen format export.',
    },
    {
      date: '2026-11-09',
      title: 'Script v03 shared',
      description: 'James updated the script based on the messaging document.',
    },
    {
      date: '2026-11-05',
      title: 'Forced perspective R&D',
      description:
        'Alex researching anamorphic projection techniques, referencing MasterChef curved-screen setup and Piccadilly Lights DeepScreen workflow. VR headset testing planned for sweet-spot validation.',
    },
  ],
  screenSpecs: [
    { label: 'Venue', value: 'Dharan Expo, Hall 1' },
    { label: 'Screen config', value: 'Multi-panel, curved (specs TBC from staging team)' },
    { label: 'Screen length', value: 'Adjustable' },
    { label: 'Projection type', value: 'Forced perspective / anamorphic 3D' },
    { label: 'Laser integration', value: 'Yes (external supplier recommended)' },
    { label: 'UV pass required', value: 'Yes (screen format export, similar to Ocean Outdoor workflow)' },
  ],
  links: [
    {
      label: 'Script v03',
      url: 'https://docs.google.com/document/d/1ayVlX54fqgrrDMdFZ6phFeC24J_4OrpqNm8iCgoWXkE/edit',
    },
    {
      label: 'Forced perspective reference (MasterChef)',
      url: 'https://www.youtube.com/watch?v=-fpobu4hv0o',
    },
    {
      label: 'Anamorphic curved-screen thread',
      url: 'https://blenderartists.org/t/how-to-render-3d-anamorphic-movie-on-curved-screen-or-fake-3d-image/1300925/3',
    },
    {
      label: 'Richard Attias & Associates (agency)',
      url: 'https://richardattiasassociates.com/en',
    },
    {
      label: 'Animation Files (Google Drive)',
      url: 'https://drive.google.com/drive/folders/1ztclxJnyhjJi4RaBB8Py_YkhFtGuVGsv',
    },
    {
      label: 'Slack channel',
      url: 'https://wearerd.slack.com/archives/C0CE2M658SK',
    },
  ],
};
