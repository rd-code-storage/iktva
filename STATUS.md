# Project status

_Last updated 11/11/2026 by Alex Gorcik with Claude (DELIVER renderer decision). Draft set up from the 3D files: Alex to confirm._

## Where we are

**Phase: Pre-production, forced perspective R&D.**

The Grand Hall master scene is built (`Iktva Grand Hall_V01.c4d`). It contains:

- a blockout of the venue;
- a curved LED wall whose sizes can be changed;
- the sweet-spot cameras;
- a three-pass render setup: EYE, then DELIVER flat file, then ROOM PREVIEW.

A robot arm test is being used to prove the illusion. Room previews V01 to V05 were rendered on 10 and 11 November.

## What you need to know right now

- **LED sizes are working values, not confirmed.** The staging team still has to confirm the size, curve, pixel pitch and pixel map. Change them only on the LED WALL object's User Data. See Technical > LED wall.
- **The sweet spot is CAM EYE A.** It sits at seated eye height. Don't move it without agreement, because every render depends on it.
- **The robot arm test file differs from the master in two ways.** EYE A is at 1.66 m instead of 1.20 m, and DELIVER scale is 0.1 (test size). Don't deliver from it as it is.
- **There are two venue blockouts.** The Grand Hall file (54 x 91 m) is current. The older Event Space file (59.7 x 59.7 m) needs confirming or retiring.
- **File naming.** Follow the draft convention on the Technical page. The automatic timeline uses it to recognise versions.

## Decisions

| Date | Decision | Why |
|---|---|---|
| 10/11/2026 | Three-pass workflow: EYE, then DELIVER, then ROOM PREVIEW | Separates the 3D content from the LED mapping, so the screen spec can change without re-animating. |
| 11/11/2026 | DELIVER (flat file) pass renders with the Standard renderer; EYE and ROOM PREVIEW stay on Redshift | The flat file only re-maps the EYE render onto the pixel map, so Redshift's compute adds nothing. Master file's DELIVER setting still needs switching to Standard. |
| 10/11/2026 | 30 fps, Redshift, 1 unit = 1 cm | Team standard for all scenes. |
| 10/11/2026 | Large files on Google Drive, under 50 MB in the repo | Keeps the repo usable. |

## Open questions and blockers

- [ ] Final LED spec and pixel map from the staging team (blocks delivery spec)
- [ ] Media server and delivery codec
- [ ] Audience layout, to confirm the sweet spot and test seats
- [ ] Laser supplier, sync method, and areas to keep clear for lasers
- [ ] Colour management: agree OCIO colour spaces
- [ ] Which venue blockout is correct
- [ ] The AE template script `IKTVA_Hall1_Build_AE_Template.jsx` is empty

## What's left to do

- [ ] Finish the robot arm test and review it from the sweet spot and the test seats
- [ ] VR sweet-spot validation
- [ ] Break the script (v03) down into a shot list on the Shots page
- [ ] Agree the naming convention and colour management before production renders
- [ ] Animatic
- [ ] First full pass, then client review, then final delivery
- [ ] On-site tech and rehearsal at Dhahran Expo

## Recent activity

_The daily summary updates this section automatically. The full history is on the Timeline page._

- 11/11/2026: Robot arm test room previews V02 to V05 rendered; preview movies V02 and V03 exported.
- 10/11/2026: Grand Hall master scene built; first EYE, flat file and preview renders.
