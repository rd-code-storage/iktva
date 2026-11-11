// Production information shown on the Production and Start pages.
// Keep newest review entries at the TOP. Use YYYY-MM-DD for dates.
// tbc: true flags anything still to be confirmed.

export interface Milestone {
  date: string; // YYYY-MM-DD, or '' if not set
  title: string;
  status: 'done' | 'next' | 'planned';
  note?: string;
  tbc?: boolean;
}

export const milestones: Milestone[] = [
  { date: '2026-11-05', title: 'Forced perspective R&D started', status: 'done' },
  { date: '2026-11-09', title: 'Script v03', status: 'done' },
  { date: '2026-11-10', title: 'Grand Hall master scene with LED rig and three render passes', status: 'done' },
  { date: '2026-11-11', title: 'Robot arm forced perspective test (preview V01 to V05)', status: 'next' },
  { date: '', title: 'Final screen specs and pixel map from staging team', status: 'planned', tbc: true },
  { date: '', title: 'Shot list broken down from the script', status: 'planned', tbc: true },
  { date: '', title: 'Animatic', status: 'planned', tbc: true },
  { date: '', title: 'VR sweet-spot validation', status: 'planned', tbc: true },
  { date: '', title: 'First full pass', status: 'planned', tbc: true },
  { date: '', title: 'Client review', status: 'planned', tbc: true },
  { date: '', title: 'Final delivery to media server', status: 'planned', tbc: true },
  { date: '', title: 'On-site tech and rehearsal, Dhahran Expo', status: 'planned', tbc: true },
  { date: '', title: 'IKTVA 2027 event', status: 'planned', tbc: true },
];

export interface Review {
  date: string;
  version: string; // what was shown, e.g. 'GrandHall_TEST preview V04'
  shownTo: string;
  feedback: string;
  outcome: 'approved' | 'changes' | 'info';
}

// Add an entry every time work is shown to the director, producer or client.
export const reviews: Review[] = [];

export const laser: { label: string; value: string; tbc?: boolean }[] = [
  { label: 'Supplier', value: 'External supplier recommended over Saudi-based options', tbc: true },
  { label: 'Coordination', value: 'Being coordinated with Soul TPHQ' },
  { label: 'Import route', value: 'Kit import under the local entity is the preferred route' },
  { label: 'Sync method', value: 'TBC (timecode from media server?)', tbc: true },
  { label: 'Cue sheet', value: 'Not started', tbc: true },
  { label: 'Areas to keep dark / clear for lasers', value: 'TBC: affects the animation and must be known before final renders', tbc: true },
];

export const venue: { label: string; value: string; tbc?: boolean }[] = [
  { label: 'Venue', value: 'Dhahran Expo, Hall 1 (Grand Hall)' },
  { label: 'Working blockout', value: '54 x 91 x 11 m, from OBJ (footprint +/-2%), in Iktva Grand Hall_V01.c4d' },
  { label: 'Earlier blockout', value: '59.7 x 59.7 m, from PDF, in Iktva Event Space_V0x.c4d: confirm which is correct', tbc: true },
  { label: 'Drawings / CAD', value: 'Not in the repo yet: add to Google Drive and link on the Assets page', tbc: true },
  { label: 'Site photos', value: 'Ref pics folder on U: (04. 3D/Ref pics)', tbc: true },
  { label: 'Audience layout', value: 'TBC from staging team (needed for sweet-spot and test seats)', tbc: true },
  { label: 'Projector / LED positions', value: 'TBC from staging team', tbc: true },
];

export const brand: { label: string; value: string; tbc?: boolean }[] = [
  { label: 'IKTVA 2027 logo pack', value: 'Not yet collected', tbc: true },
  { label: 'Aramco logo and usage rules', value: 'Not yet collected', tbc: true },
  { label: 'Fonts', value: 'TBC', tbc: true },
  { label: 'Colour palette', value: 'TBC', tbc: true },
  { label: 'Where to keep them', value: 'Google Drive animation folder, linked from the Assets page as category "document"' },
];

export const onboarding: { item: string; detail: string }[] = [
  { item: 'U: drive access', detail: 'U:\\Projects\\2482-3-iktva-pitches - Off the Scale\\02. Animation (3D work is in 04. 3D; ask IT)' },
  { item: 'Google Drive', detail: 'Animation Files folder (link on the Overview page)' },
  { item: 'Slack', detail: 'Project channel (link on the Overview page)' },
  { item: 'GitHub', detail: 'Read access to rd-code-storage/iktva; write access if you will update this site' },
  { item: 'Cinema 4D 2027 + Redshift', detail: 'Same versions as the team, see Technical > Scene setup' },
  { item: 'Read first', detail: 'Start here, then Technical (pipeline, cameras, naming), then the Timeline' },
  { item: 'Open the master scene', detail: 'Iktva Grand Hall_V01.c4d. Save your own copy as a new version before changing anything' },
  { item: 'Who to ask', detail: '3D / pipeline: Alex Gorcik. Production: Benjamin Raymond, Bella Servidio. Creative: Ryan, Will Jarvis. Full list on the Team page' },
];
