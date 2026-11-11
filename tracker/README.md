# 3D folder tracker

Keeps the site's **Timeline** up to date with what happens in the project's 3D folder:

`U:\Projects\2482-3-iktva-pitches - Off the Scale\02. Animation\04. 3D`

## How it works

`scan-3d.ps1` lists every file in the folder and compares it with the last snapshot (`manifest.json`). It turns the differences into readable events in `src/content/timeline.json`, then commits and pushes. The site redeploys and the Timeline updates.

How it decides what to record:

- **Render sequences** (`preview_V04_0000.png` … `0090.png`) become one event, such as "Rendered preview_V04, 91 frames".
- **New versions** are recognised from `_V01` / `_V02` names, for example "New version: Iktva Event Space_V03.c4d (previous: V02)".
- **Repeated saves** of a file within 12 hours update one event ("saved 5 times"), so they don't add new entries.
- **Who** comes from the Windows owner of the file. It is mapped to a real name in `people.json`; add new team members there.
- **What is recorded:** only file information (path, size, modified time, owner). File contents are never read or uploaded.
- **Ignored files:** hidden, temporary and lock files.

## Where it runs

It runs on Alex's PC, because GitHub can't see the U: drive. A Windows scheduled task, **IKTVA 3D folder tracker**, runs it every 30 minutes and at log-on, from a dedicated clone named `iktva-auto-tracker` that sits next to the main repo folder. Before each scan it resets that clone to GitHub's `main`. **Never edit files in the tracker clone**; edit them in the normal repo and push.

Some limits:

- It only runs while the PC is on, someone is logged in, and U: is connected.
- Changes made while it is off are picked up on the next scan, dated by the files' modified times.
- Deletions are dated by when they were noticed.

## Commands

```powershell
# Set up, or update the scheduled task (run once per PC)
powershell -ExecutionPolicy Bypass -File tracker\install-task.ps1

# Test a scan without committing (writes manifest.json and timeline.json locally)
powershell -ExecutionPolicy Bypass -File tracker\scan-3d.ps1 -NoGit

# Run the scheduled task now
Start-ScheduledTask -TaskName 'IKTVA 3D folder tracker'

# Check what it did
Get-Content "..\iktva-auto-tracker\tracker\scan.log" -Tail 20

# Remove it
Unregister-ScheduledTask -TaskName 'IKTVA 3D folder tracker' -Confirm:$false
```

## Files

| File | What |
|---|---|
| `scan-3d.ps1` | The scanner |
| `install-task.ps1` | Creates the tracker clone and the scheduled task |
| `people.json` | Windows account → display name |
| `manifest.json` | Last snapshot of the folder (written by the scanner) |
| `scan.log` | Local log, not committed |
| `../src/content/timeline.json` | The events shown on the Timeline (written by the scanner) |

Tracker commits carry a `Tracked-By: 3D folder scanner` trailer. The Changes page uses it to hide them by default.
