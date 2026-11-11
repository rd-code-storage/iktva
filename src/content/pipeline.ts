// Pipeline standards for the 3D team, shown on the Technical page.
// Values marked tbc: true are still to be confirmed and are flagged on the site.
// Facts below were read from the working C4D files on 2026-11-11
// (Iktva Grand Hall_V01.c4d and Iktva Grand Hall_V01_TEST_RobotArm.c4d).

export interface Spec {
  label: string;
  value: string;
  note?: string;
  tbc?: boolean;
}

export const sceneSetup: Spec[] = [
  { label: 'Cinema 4D', value: '2027.0', note: 'Open and save scenes in this version so everyone can open them.' },
  { label: 'Renderer', value: 'Redshift', note: 'Default for all passes. New materials, lights and cameras should be Redshift.' },
  { label: 'Scene unit', value: '1 unit = 1 cm', note: 'Display in metres. Venue and LED sizes are real-world scale.' },
  { label: 'Frame rate', value: '30 fps', note: 'Project, render settings and delivery all at 30 fps.' },
  { label: 'Colour management', value: 'OCIO enabled', note: 'Exact render, view and display colour spaces still to be agreed and written here.', tbc: true },
  { label: 'Plugins', value: 'None required yet', note: 'List any plugin (with version and licence owner) here before using it in a shared scene.' },
  { label: 'Master scene', value: 'Iktva Grand Hall_V01.c4d', note: 'Contains the venue blockout, LED rig, sweet-spot cameras and the three render takes. Start new work from a copy of it.' },
];

export const renderPasses: Spec[] = [
  {
    label: '1  EYE',
    value: '16384 x 2582 px, Redshift',
    note: 'The 3D world seen from the sweet spot through CAM EYE A. Venue geometry is hidden. Output: renders/<shot>/1_EYE/',
  },
  {
    label: '2  DELIVER (flat file)',
    value: '33883 x 3000 px (full LED pixel map)',
    note: 'The EYE render unrolled onto the LED pixel map. This is what plays on the wall. Use DELIVER scale 0.1 on the LED WALL object for quick tests (3388 x 300). Output: renders/<shot>/2_FLAT_FILE/',
  },
  {
    label: '3  ROOM PREVIEW',
    value: '1920 x 1080 px, Redshift',
    note: 'The flat file playing on the curved LED, seen from a seat. Use this to judge whether the illusion works. Output: renders/<shot>/0_PREVIEW/',
  },
];

export const ledWall: Spec[] = [
  { label: 'Front width', value: '49 m', tbc: true },
  { label: 'Return depth towards audience', value: '20 m (each side)', tbc: true },
  { label: 'Corner radius', value: '5 m', note: '0 = hard 90 degree corner.', tbc: true },
  { label: 'Total LED length', value: '84.71 m', note: 'Front 39.00 + 2 x corner arc 7.85 + 2 x straight return 15.00.' },
  { label: 'LED height', value: '7.5 m', tbc: true },
  { label: 'LED bottom above floor', value: '1.1 m', tbc: true },
  { label: 'Front LED distance from stage-end wall', value: '7.6 m', tbc: true },
  { label: 'Pixel pitch', value: '2.5 mm', tbc: true },
  { label: 'Full pixel map', value: '33883 x 3000 px', note: 'Derived from length, height and pitch.' },
  { label: 'EYE render horizontal FOV', value: '103.8 degrees' },
];

export const ledWallNote =
  'All LED sizes are working values set on the LED WALL object (User Data) in the master scene. Change them there, never by hand on the mesh: the cameras, flat-file size and render resolutions update from it. Values marked TBC need confirming by the staging team.';

export const cameras: Spec[] = [
  { label: 'CAM EYE A', value: 'Seat sweet spot, eye height 1.2 m', note: 'The camera the illusion is built for. Driven (level, auto-framed). Every EYE render goes through this camera.' },
  { label: 'CAM EYE B', value: 'Camera platform, 2.4 m high, 24.9 m behind EYE A', note: 'Alternative sweet spot (e.g. for the broadcast camera). Link it on the LED WALL object to use it.' },
  { label: 'CAM VIEW', value: 'Seat A, 14 mm', note: 'What the audience sees. For checking, not for rendering.' },
  { label: 'CAM DELIVER', value: 'Driven, do not move', note: 'Renders the flat file. Positioned automatically by the LED rig.' },
  { label: 'CAM TEST cameras', value: 'Front-left, back-right, 10 m behind, platform', note: 'Off-sweet-spot seats for checking how bad the illusion gets elsewhere in the room.' },
  { label: 'CAM Overview', value: 'Free camera', note: 'For looking around the venue.' },
];

export const sweetSpotNote =
  'The sweet spot is the seat the forced perspective is built for. Never move CAM EYE A by hand: move it only by agreement, and log the change on the Production page review log. The calculator script (assets/scripts/sweet_spot_calc.py on the Assets page) computes the optimal position from screen width, height and curve radius.';

export const namingRules: { rule: string; example: string }[] = [
  { rule: 'Scenes: Project_Subject_Vxx.c4d, two-digit version, never overwrite an older version', example: 'Iktva Grand Hall_V02.c4d' },
  { rule: 'Test or variant scenes add a suffix after the version', example: 'Iktva Grand Hall_V01_TEST_RobotArm.c4d' },
  { rule: 'Renders go in renders/<SHOT>/<PASS>/Vxx/, one folder per version', example: 'renders/GrandHall_TEST/0_PREVIEW/V04/' },
  { rule: 'Pass folders: 0_PREVIEW, 1_EYE, 2_FLAT_FILE', example: '1_EYE/V02/eye_V02_0000.png' },
  { rule: 'Frames: <pass>_Vxx_####.png, four-digit frame numbers starting at 0000', example: 'preview_V04_0074.png' },
  { rule: 'Preview movies sit next to their version folders, same version number', example: '0_PREVIEW/preview_V04.mp4' },
  { rule: 'Approved versions: copy to an APPROVED folder; never rename the original', example: 'renders/GrandHall_TEST/APPROVED/' },
];

export const namingNote =
  'Draft based on how files are already being saved. The automatic timeline relies on these names to recognise new versions and render sequences, so please stick to them. Agree final wording before production renders start.';

export const folderLayout = `04. 3D/
  Event Space/
    Test/                  working scenes (Vxx), tests
      assets/              imported models (e.g. mixamo/)
      maps/                texture checks
      AE/                  After Effects templates
      renders/
        <SHOT>/
          0_PREVIEW/Vxx/   room preview frames + preview_Vxx.mp4
          1_EYE/Vxx/       eye renders
          2_FLAT_FILE/Vxx/ LED flat files (delivery)
        DEMO_flat_files_1-10th_scale/
        FOOTAGE/
  Ref pics/                reference images`;

export const deliverySpec: Spec[] = [
  { label: 'Canvas', value: '33883 x 3000 px (full LED pixel map at 2.5 mm)', note: 'Depends on final LED spec.', tbc: true },
  { label: 'Pixel map template', value: 'Not yet supplied', note: 'Needed from the staging team: panel layout, processor splits and any dead areas.', tbc: true },
  { label: 'Frame rate', value: '30 fps', tbc: true },
  { label: 'Media server', value: 'TBC', note: 'Determines codec and how the canvas is split.', tbc: true },
  { label: 'Codec / container', value: 'TBC (e.g. HAP, NotchLC or ProRes)', tbc: true },
  { label: 'Bit depth / colour', value: 'TBC', tbc: true },
  { label: 'Audio', value: 'TBC', note: 'Separate WAV with timecode, or embedded.', tbc: true },
  { label: 'Delivery naming', value: 'TBC', tbc: true },
  { label: 'Delivery method', value: 'TBC', tbc: true },
];

export const deliveryChecklist: string[] = [
  'Rendered from the agreed EYE camera, and the DELIVER scale is 1.0 (not the 0.1 test scale)',
  'Flat file matches the pixel map exactly (size, panel order, no scaling)',
  'Frame count and duration match the edit, 30 fps',
  'Checked as a ROOM PREVIEW from the sweet spot and from the test seats',
  'Encoded to the media server format and test-played on the server',
  'Filed under the agreed delivery name and logged on the Production page',
];

export const gotchas: { issue: string; detail: string }[] = [
  {
    issue: 'Leave DELIVER scale at 1.0 for real deliveries',
    detail: 'The LED WALL object has a DELIVER scale. 0.1 gives a quick 3388 x 300 test. The robot-arm test file is currently at 0.1.',
  },
  {
    issue: 'CAM EYE A height differs between files',
    detail: 'EYE A is at 1.20 m in Iktva Grand Hall_V01.c4d but 1.66 m in the _TEST_RobotArm file. Renders from the two files will not line up. Agree one sweet-spot height.',
  },
  {
    issue: 'DELIVER take says "Standard" but uses Redshift in the master file',
    detail: 'The DELIVER render setting is labelled Standard. It uses Standard in the robot-arm test but Redshift in Iktva Grand Hall_V01.c4d. Pick one so flat files match.',
  },
  {
    issue: 'Two venue blockouts exist',
    detail: 'Iktva Event Space_V0x uses "HALL 1, 59.7 x 59.7 m (from PDF)". The Grand Hall file uses "GRAND HALL, 54 x 91 x 11 m (blockout from OBJ)". The Grand Hall file is the current one: confirm which matches the real venue.',
  },
  {
    issue: 'AE template script is empty',
    detail: 'Event Space/Test/AE/IKTVA_Hall1_Build_AE_Template.jsx is 0 bytes.',
  },
  {
    issue: 'Move the LED rig with SCREEN ANCHOR',
    detail: 'Content that should stick to the screen must be parented under SCREEN ANCHOR (front LED, bottom centre). The anchor moves with the LED sizes.',
  },
];

export const glossary: { term: string; meaning: string }[] = [
  { term: 'Forced perspective / anamorphic', meaning: 'Content distorted so that, from one viewpoint, flat screens appear to contain real 3D depth.' },
  { term: 'Sweet spot', meaning: 'The seat the illusion is built for. It looks right from there and increasingly wrong further away.' },
  { term: 'EYE render', meaning: 'What the scene looks like from the sweet spot, before it is mapped onto the screen.' },
  { term: 'Flat file / DELIVER', meaning: 'The EYE render unrolled onto the LED pixel map. Looks distorted on a monitor, correct in the room.' },
  { term: 'UV pass', meaning: 'Mapping that tells each LED pixel which part of the EYE render it shows. Same idea as the flat file.' },
  { term: 'Pixel map', meaning: 'The exact pixel layout of the LED wall supplied by the staging team. Deliveries must match it.' },
  { term: 'Pixel pitch', meaning: 'Distance between LED pixel centres (2.5 mm here). Sets the canvas resolution.' },
  { term: 'Return', meaning: 'The side sections of LED that wrap from the front wall towards the audience.' },
  { term: 'Media server', meaning: 'The playback machine that drives the LED wall. Decides the delivery codec.' },
  { term: 'Take', meaning: 'C4D Take System variant of the scene. The master file has one take per render pass.' },
];
