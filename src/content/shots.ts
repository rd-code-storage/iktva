// Shot and task list, shown on the Shots page.
//
// status: where the shot is now. owner: who is doing it.
// match: a regular expression tested against file paths in the 3D folder
//        (as they appear on the Timeline, e.g. 'Event Space\\Test\\renders\\GrandHall_TEST\\...').
//        The Shots page uses it to show the latest version and last activity automatically.
//
// Draft set up on 2026-11-11 from the files in the 3D folder. The real shot list
// still needs breaking down from the script (Script v03).

export type ShotStatus =
  | 'Not started'
  | 'R&D'
  | 'Blocking'
  | 'Animating'
  | 'Lighting'
  | 'Rendering'
  | 'In review'
  | 'Changes'
  | 'Approved'
  | 'Delivered'
  | 'On hold';

export interface Shot {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: ShotStatus;
  match?: string;
  duration?: string;
  notes?: string;
}

export const shots: Shot[] = [
  {
    id: 'GH-TEST',
    name: 'Grand Hall forced perspective test (robot arm)',
    description: 'Robot arm animated in the recess behind the LED wall to prove the forced perspective illusion from the sweet spot.',
    owner: 'Alex Gorcik',
    status: 'Rendering',
    match: 'GrandHall_TEST|Grand Hall_V\\d+_TEST_RobotArm|RobotArm',
    duration: '91 frames (3 s at 30 fps)',
    notes: 'Room previews V01 to V05 rendered on 10-11/11. Flat file and eye passes at V02.',
  },
  {
    id: 'MASTER',
    name: 'Grand Hall master scene',
    description: 'Venue blockout, LED rig with adjustable sizes, sweet-spot cameras and the three render takes. Every shot starts from this.',
    owner: 'Alex Gorcik',
    status: 'R&D',
    match: 'Iktva Grand Hall_V\\d+\\.c4d$',
  },
  {
    id: 'PITCH',
    name: 'Pitch film sequence',
    description: 'Frames from the pitch film (Off The Scale v5), kept as footage.',
    owner: 'Alex Gorcik',
    status: 'On hold',
    match: 'Pitch film sequence',
    notes: 'Confirm whether this is still used.',
  },
  {
    id: 'HALL1-OLD',
    name: 'Hall 1 event space blockout (earlier)',
    description: 'Earlier 59.7 x 59.7 m Hall 1 blockout with front screens and side walls rendered as separate flat files.',
    owner: 'Alex Gorcik',
    status: 'On hold',
    match: 'Iktva Event Space_V\\d+|DEMO_flat_files',
    notes: 'Superseded by the Grand Hall master scene? Confirm.',
  },
  {
    id: 'FILM',
    name: 'Event film shots',
    description: 'The shots of the final film. To be broken down from Script v03 into individual rows here.',
    owner: 'TBC',
    status: 'Not started',
  },
];
