# IKTVA 2027 - Project Knowledge Base

## What this is

This is the GitHub repo for the IKTVA 2027 "Off the Scale" project knowledge base. It's an Astro static site deployed to GitHub Pages at https://rd-code-storage.github.io/iktva/. The site is a shared resource for the animation and production team at RD Content.

The site stores scripts, references, renders, documents, 3D model info, screen specs, key links, and a running timeline of project updates.

Large files (3D models, full renders, video) live on Google Drive: https://drive.google.com/drive/folders/1ztclxJnyhjJi4RaBB8Py_YkhFtGuVGsv

Files under ~50MB can go directly in the repo under public/assets/.

The project's working 3D files are on the network drive, not in this repo:
`U:\Projects\2482-3-iktva-pitches - Off the Scale\02. Animation\04. 3D`. When someone refers to a 3D file by name, look for it there. If it isn't there, or several files match, ask them to confirm which file they mean before using it.

## Answering "what's happened / what do I need to know / what's left?"

New team members will ask questions like these. Answer from the records in this repo, not from memory, and say where each answer came from:

1. **`STATUS.md`**: current phase, what you need to know now, decisions, open questions and what's left to do. Read it first.
2. **`src/content/timeline.json`**: automatic file activity in the 02. Animation folder on U: (After Effects, 3D, assets, exports: renders, new versions, saves), newest first, with who did it. `src/content/summaries.json` has daily summaries.
3. **`git log`**: changes to this repo (who changed what and when). Commits with a `Tracked-By:` trailer are automatic tracker commits.
4. **`src/content/shots.ts`**: every shot or task, its owner and status. **`src/content/production.ts`**: schedule, review log, laser, venue, brand, onboarding. **`src/content/pipeline.ts`**: scene setup, render passes, LED wall, cameras, naming, delivery, known issues.
5. **`src/content/project.ts`**: team, links and project updates.

Give a short answer first: what has happened, what to watch out for, what's next. Then point to the site pages (Start here, Timeline, Shots, Technical, Production). Flag anything marked TBC or dated more than a week ago as possibly out of date.

## Keeping the knowledge base current

When you help with this project, keep these up to date in the same commit as the work:

- **`STATUS.md`**: update "What you need to know right now", "Decisions" (with date and reason), "Open questions" and "What's left to do" whenever they change. Keep the "Last updated" line current.
- **Shots** (`src/content/shots.ts`): status and owner. Latest version and last activity are filled in automatically from the timeline using each shot's `match` pattern.
- **Reviews** (`reviews` in `src/content/production.ts`): log every time work is shown to the director, producer or client, newest first.
- **Known issues** (`gotchas` in `src/content/pipeline.ts`): add anything that broke, and the fix.
- **TBC values**: when a TBC is confirmed, set the value and remove `tbc: true`.
- **Never edit `src/content/timeline.json` or `tracker/manifest.json` by hand.** The tracker owns them.

## Tech stack

- Astro 5.x, static site generation
- Deployed via GitHub Actions on push to main
- Base path: /iktva (configured in astro.config.mjs)
- Site URL: https://rd-code-storage.github.io/iktva/

## Project structure

```
STATUS.md              # Current status, decisions, open questions, what's left (shown on Start here)
tracker/               # Animation folder scanner (see tracker/README.md)
src/
  content/
    assets.ts          # Asset catalog (all downloadable files, references, models)
    project.ts         # Project info, team, updates, screen specs, key links
    shots.ts           # Shot / task list with owner and status
    production.ts      # Milestones, review log, laser, venue, brand, onboarding
    pipeline.ts        # Scene setup, render passes, LED wall, cameras, naming, delivery, gotchas, glossary
    timeline.json      # AUTOMATIC: file events from the animation folder (do not edit)
    timeline.ts        # Loads timeline.json + summaries.json, date helpers
    summaries.json     # Daily summaries written by the scheduled Claude task
    credits.ts         # Credit corrections for early commits (Changes page)
  layouts/
    Base.astro         # Site layout with nav header and global styles
  pages/
    index.astro        # Homepage: hero, specs, links, latest 3 updates
    start.astro        # Start here: STATUS.md, latest activity, onboarding
    timeline.astro     # Timeline: file activity + project updates, by day
    shots.astro        # Shots: status table
    production.astro   # Schedule, reviews, laser, venue, brand
    technical.astro    # Pipeline standards (from pipeline.ts)
    assets.astro       # Assets page: filterable grid of all assets
    updates.astro      # Project updates only (also shown on Timeline)
    team.astro         # Team members and roles
    changes.astro      # Every commit and who made it
public/
  assets/
    scripts/           # Python, C4D, Blender scripts
    references/        # Reference images, videos, mood boards
    renders/           # Test renders, final renders
    documents/         # PDFs, specs, delivery guides
    models/            # 3D model files (C4D, OBJ, FBX)
```

## How to add an asset

Assets are defined in `src/content/assets.ts`. Each asset has this shape:

```ts
{
  id: 'kebab-case-unique-id',
  title: 'Human readable title',
  category: 'script' | 'reference' | 'render' | 'document' | 'model',
  author: 'Person Name',
  date: 'YYYY-MM-DD',
  description: 'What this asset is and what it is used for.',
  files: [
    { path: 'assets/scripts/filename.py', label: 'filename.py', size: '1.8 KB' },
    // OR for external links:
    { path: 'https://drive.google.com/...', label: 'Google Drive' },
  ],
  thumbnail: 'assets/references/thumbnail.webp',  // optional, path relative to public/
}
```

Steps:
1. If the user provides a file, save it to the correct subfolder under `public/assets/` (scripts/, references/, renders/, documents/, or models/).
2. Add a new entry to the `assets` array in `src/content/assets.ts`.
3. Set the file path relative to `public/` (e.g. `assets/references/hall1-screenshot.png`). Do NOT include `public/` in the path.
4. For files hosted externally (Google Drive, YouTube, etc.), use the full URL as the path.
5. Commit and push to main. The site redeploys automatically.

The five asset categories and their display labels:
- `script` - "Scripts"
- `reference` - "References"
- `render` - "Renders"
- `document` - "Documents"
- `model` - "3D Models"

## How to add a project update

Updates are in the `updates` array in `src/content/project.ts`. Add new entries at the TOP of the array (newest first):

```ts
{
  date: 'YYYY-MM-DD',
  title: 'Short title of what happened',
  description: 'One or two sentences with more detail.',
}
```

The homepage shows the 3 most recent updates. The updates page shows all of them.

## How to update project info

All in `src/content/project.ts`:
- `screenSpecs` array: `{ label: string, value: string }` pairs
- `links` array: `{ label: string, url: string }` pairs
- `team` array: `{ name: string, role: string }` pairs
- `status`: current project phase (e.g. 'Pre-Production')

## Important conventions

- **Dates**: Store as `YYYY-MM-DD` in data files. Pages format them to UK style (DD/MM/YYYY) automatically.
- **Paths**: Internal file paths are relative to `public/` with no leading slash. e.g. `assets/renders/hall1.png`
- **Links in templates**: Use `${import.meta.env.BASE_URL}pagename/` format. BASE_URL is `/iktva/` (with trailing slash), so do NOT add an extra slash before the page name.
- **Trailing slashes**: All page URLs end with a trailing slash (configured in astro.config.mjs).
- **Image sizes**: Keep images for the site under 5MB each. Resize or compress if needed. WebP is preferred.
- **Large files**: Anything over 50MB should go on Google Drive, not in the repo. Add a link to it in the assets catalog.
- **Commit messages**: Be descriptive. e.g. "Add Hall 1 render screenshots from Alex" not "update files".

## Change tracker

The Changes page (`src/pages/changes.astro`, at /iktva/changes/) lists every commit, newest first, labelled with its git author name, and can be filtered by person. It is generated from `git log` at build time, so there is nothing to edit by hand. The deploy workflow checks out full history (`fetch-depth: 0`) for this.

For changes to be labelled with the right person:
- Commit as the person who asked for the change: their git `user.name` must be their real name (e.g. "Alex Gorcik"). Never author commits as "Claude" on someone's behalf.
- When Claude helped make the change, add a `Co-Authored-By: Claude ...` trailer. The page shows that as a "with Claude" tag next to the person's name.
- Don't rewrite or force-push `main`: the history is the audit trail.
- Early commits saved as "Claude" are credited to the right person in `src/content/credits.ts` (by full commit hash). Only add past commits there; new commits should be authored correctly.
- Email addresses are not shown on the page (the site is public).

## Google Drive integration

The shared Drive folder for large animation files:
https://drive.google.com/drive/folders/1ztclxJnyhjJi4RaBB8Py_YkhFtGuVGsv

When adding a large file to Drive, also add an asset entry in `src/content/assets.ts` with the Drive link as the file path so it appears on the site.

## Deployment

The site auto-deploys via GitHub Actions when changes are pushed to `main`. Deployment takes about 2 minutes. No manual steps needed.

## Project context

- **Project**: IKTVA 2027 "Off the Scale" (project code 2491)
- **Client**: Aramco
- **Venue**: Dharan Expo, Hall 1
- **Producer**: RD Content
- **What it is**: Immersive event film with forced-perspective animation across large-format screens and laser integration
- **Key challenge**: Anamorphic/forced perspective projection on curved multi-panel screens
