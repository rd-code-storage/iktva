# IKTVA 2027 - Project Knowledge Base

## What this is

This is the GitHub repo for the IKTVA 2027 "Off the Scale" project knowledge base. It's an Astro static site deployed to GitHub Pages at https://rd-code-storage.github.io/iktva/. The site is a shared resource for the animation and production team at RD Content.

The site stores scripts, references, renders, documents, 3D model info, screen specs, key links, and a running timeline of project updates.

Large files (3D models, full renders, video) live on Google Drive: https://drive.google.com/drive/folders/1ztclxJnyhjJi4RaBB8Py_YkhFtGuVGsv

Files under ~50MB can go directly in the repo under public/assets/.

## Tech stack

- Astro 5.x, static site generation
- Deployed via GitHub Actions on push to main
- Base path: /iktva (configured in astro.config.mjs)
- Site URL: https://rd-code-storage.github.io/iktva/

## Project structure

```
src/
  content/
    assets.ts          # Asset catalog (all downloadable files, references, models)
    project.ts         # Project info, team, updates, screen specs, key links
  layouts/
    Base.astro         # Site layout with nav header and global styles
  pages/
    index.astro        # Homepage: hero, specs, links, latest 3 updates
    assets.astro       # Assets page: filterable grid of all assets
    updates.astro      # Timeline: all project updates, newest first
    technical.astro    # Technical production info
    team.astro         # Team members and roles
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
