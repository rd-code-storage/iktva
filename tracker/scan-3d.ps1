<#
  IKTVA 3D folder tracker
  -----------------------
  Scans the project's 3D folder on the U: drive, compares it with the last
  snapshot (tracker/manifest.json) and records what changed as readable events
  in src/content/timeline.json, which the site's Timeline page shows.

  Only file information is recorded: path, size, modified time and owner.
  File contents are never read or uploaded.

  - Render frame sequences (name_0001.png ...) become one event, not one per frame.
  - Repeated saves of the same file within MergeHours update one event
    ("saved 5 times") instead of adding new ones.
  - New versions are detected from _V01 / _V02 style names.
  - Each event is credited to the Windows owner of the file (mapped to a real
    name in tracker/people.json).

  Normally run by Windows Task Scheduler from the dedicated tracker clone
  (see tracker/README.md). Run with -NoGit to test without committing.
#>
param(
  [string]$Root = 'U:\Projects\2482-3-iktva-pitches - Off the Scale\02. Animation\04. 3D',
  [switch]$NoGit,
  [int]$MergeHours = 12,
  [int]$MaxEvents = 3000
)

$ErrorActionPreference = 'Stop'
$TrackerDir   = $PSScriptRoot
$Repo         = Split-Path -Parent $TrackerDir
$ManifestPath = Join-Path $TrackerDir 'manifest.json'
$PeoplePath   = Join-Path $TrackerDir 'people.json'
$LogPath      = Join-Path $TrackerDir 'scan.log'
$TimelinePath = Join-Path $Repo 'src\content\timeline.json'
$Utf8NoBom    = New-Object System.Text.UTF8Encoding $false

function Write-Log([string]$msg) {
  $line = '{0:yyyy-MM-dd HH:mm:ss}  {1}' -f (Get-Date), $msg
  try { Add-Content -LiteralPath $LogPath -Value $line -Encoding UTF8 } catch {}
  Write-Host $line
}

function Invoke-Git {
  $old = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  $out = & git -C $Repo @args 2>&1 | ForEach-Object { "$_" }
  $code = $LASTEXITCODE
  $ErrorActionPreference = $old
  if ($code -ne 0) { throw "git $($args -join ' ') failed: $($out -join ' ')" }
  return $out
}

function Read-Json([string]$path) {
  if (-not (Test-Path -LiteralPath $path)) { return $null }
  $text = [System.IO.File]::ReadAllText($path)
  if (-not $text.Trim()) { return $null }
  return $text | ConvertFrom-Json
}

function Write-Json([string]$path, $obj) {
  $json = ConvertTo-Json -InputObject $obj -Depth 8
  [System.IO.File]::WriteAllText($path, $json + "`n", $Utf8NoBom)
}

function ConvertTo-Hashtable($obj) {
  $h = [ordered]@{}
  if ($null -eq $obj) { return $h }
  foreach ($p in $obj.PSObject.Properties) { $h[$p.Name] = $p.Value }
  return $h
}

# ---- classification -------------------------------------------------------

$SeqRx  = '^(?<dir>(?:.*\\)?)(?<base>[^\\]*?[_.\-])(?<num>\d{3,6})\.(?<ext>png|exr|jpe?g|tiff?|dpx|tga|psd)$'
$VerRx  = '^(?<stem>.*?)[_ \-]?[vV](?<v>\d{1,4})(?<rest>(?:[_ \-].*)?)$'
$SkipRx = '^(~|\.)|^(Thumbs\.db|desktop\.ini)$|\.(tmp|lock|bak)$'

function Get-Category([string]$ext, [bool]$seq) {
  if ($seq) { return 'render' }
  switch -Regex ($ext.ToLower()) {
    '^(c4d|blend|ma|mb|max|hip|hiplc)$'           { return 'scene' }
    '^(fbx|obj|abc|usd|usdz|usdc|gltf|glb|stl)$'  { return 'model' }
    '^(png|jpe?g|exr|tiff?|psd|tga|webp|hdr)$'    { return 'image' }
    '^(mp4|mov|avi|mxf|webm|m4v)$'                { return 'video' }
    '^(aep|prproj|drp|nk)$'                       { return 'edit' }
    '^(jsx|py|js|ps1|mel|vex|lua)$'               { return 'script' }
    '^(pdf|docx?|xlsx?|pptx?|txt|md|csv)$'        { return 'document' }
    default                                       { return 'other' }
  }
}

function Get-KeyInfo([string]$rel) {
  $m = [regex]::Match($rel, $SeqRx, 'IgnoreCase')
  if ($m.Success) {
    $base = $m.Groups['base'].Value
    return @{
      Key   = $m.Groups['dir'].Value + $base + '####.' + $m.Groups['ext'].Value
      Seq   = $true
      Frame = $m.Groups['num'].Value
      Name  = $base.TrimEnd('_', '.', '-')
      Dir   = $m.Groups['dir'].Value.TrimEnd('\')
      Ext   = $m.Groups['ext'].Value
    }
  }
  $ext = [System.IO.Path]::GetExtension($rel).TrimStart('.')
  return @{
    Key   = $rel
    Seq   = $false
    Frame = $null
    Name  = [System.IO.Path]::GetFileName($rel)
    Dir   = [System.IO.Path]::GetDirectoryName($rel)
    Ext   = $ext
  }
}

function Get-Person([string]$fullPath, $people) {
  try { $owner = (Get-Acl -LiteralPath $fullPath).Owner } catch { return 'Unknown' }
  if ($people.Contains($owner)) { return $people[$owner] }
  if ($owner -match '\\(.+)$') { return $Matches[1] }
  return $owner
}

function Get-PreviousVersion([string]$rel, $allRels) {
  $name = [System.IO.Path]::GetFileNameWithoutExtension($rel)
  $ext  = [System.IO.Path]::GetExtension($rel)
  $dir  = [System.IO.Path]::GetDirectoryName($rel)
  $m = [regex]::Match($name, $VerRx)
  if (-not $m.Success) { return $null }
  $stem = $m.Groups['stem'].Value; $rest = $m.Groups['rest'].Value; $v = [int]$m.Groups['v'].Value
  $best = $null; $bestV = -1
  foreach ($r in $allRels) {
    if ([System.IO.Path]::GetDirectoryName($r) -ne $dir -or [System.IO.Path]::GetExtension($r) -ne $ext) { continue }
    $m2 = [regex]::Match([System.IO.Path]::GetFileNameWithoutExtension($r), $VerRx)
    if (-not $m2.Success) { continue }
    if ($m2.Groups['stem'].Value -ne $stem -or $m2.Groups['rest'].Value -ne $rest) { continue }
    $v2 = [int]$m2.Groups['v'].Value
    if ($v2 -lt $v -and $v2 -gt $bestV) { $bestV = $v2; $best = $m2.Groups['v'].Value }
  }
  if ($best) { return 'V' + $best }
  return $null
}

function New-EventId { return ([guid]::NewGuid().ToString('N')).Substring(0, 12) }

# ---- main -----------------------------------------------------------------

$mutex = New-Object System.Threading.Mutex($false, 'Local\IKTVA-3D-Tracker')
if (-not $mutex.WaitOne(0)) { Write-Log 'Another scan is already running; skipping.'; exit 0 }

try {
  if (-not $NoGit) {
    Invoke-Git fetch -q origin main | Out-Null
    Invoke-Git reset -q --hard origin/main | Out-Null
  }

  if (-not (Test-Path -LiteralPath $Root)) {
    Write-Log "3D folder not reachable ($Root). Is the U: drive connected? Skipping."
    exit 0
  }

  $people = ConvertTo-Hashtable (Read-Json $PeoplePath)
  $manifestObj = Read-Json $ManifestPath
  $isBaseline = $null -eq $manifestObj

  $oldFiles = @{}; $owners = @{}
  if (-not $isBaseline) {
    foreach ($p in $manifestObj.files.PSObject.Properties) { $oldFiles[$p.Name] = $p.Value }
    if ($manifestObj.owners) { foreach ($p in $manifestObj.owners.PSObject.Properties) { $owners[$p.Name] = $p.Value } }
  }

  $timelineObj = Read-Json $TimelinePath
  $events = New-Object System.Collections.ArrayList
  if ($timelineObj -and $timelineObj.events) {
    foreach ($e in $timelineObj.events) { [void]$events.Add((ConvertTo-Hashtable $e)) }
  }

  # Scan the folder
  $nowUtc = [DateTime]::UtcNow
  $curFiles = @{}; $curMeta = @{}
  $items = Get-ChildItem -LiteralPath $Root -Recurse -File -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -notmatch $SkipRx -and -not ($_.Attributes -band [System.IO.FileAttributes]::Hidden) }
  foreach ($f in $items) {
    $rel = $f.FullName.Substring($Root.Length).TrimStart('\')
    $curFiles[$rel] = @([long]$f.Length, $f.LastWriteTimeUtc.ToString('o'))
    $curMeta[$rel] = $f
  }

  # Group changes by key (a sequence or a single file)
  $groups = @{}
  function Add-Change($rel, $type) {
    $info = Get-KeyInfo $rel
    if (-not $groups.ContainsKey($info.Key)) {
      $groups[$info.Key] = @{ Info = $info; added = @(); modified = @(); deleted = @() }
    }
    $groups[$info.Key][$type] += $rel
  }
  foreach ($rel in $curFiles.Keys) {
    if (-not $oldFiles.ContainsKey($rel)) { Add-Change $rel 'added' }
    else {
      $o = $oldFiles[$rel]; $c = $curFiles[$rel]
      if ([long]$o[0] -ne $c[0] -or [string]$o[1] -ne $c[1]) { Add-Change $rel 'modified' }
    }
  }
  foreach ($rel in $oldFiles.Keys) { if (-not $curFiles.ContainsKey($rel)) { Add-Change $rel 'deleted' } }

  # Current members of each sequence key (for frame counts)
  $members = @{}
  foreach ($rel in $curFiles.Keys) {
    $k = (Get-KeyInfo $rel).Key
    if (-not $members.ContainsKey($k)) { $members[$k] = New-Object System.Collections.ArrayList }
    [void]$members[$k].Add($rel)
  }
  $allRels = @($curFiles.Keys)

  $newEvents = New-Object System.Collections.ArrayList
  $touched = 0

  foreach ($key in $groups.Keys) {
    $g = $groups[$key]; $info = $g.Info
    $cat = Get-Category $info.Ext $info.Seq
    $present = @(); if ($members.ContainsKey($key)) { $present = @($members[$key]) }

    # who and when
    $by = 'Unknown'; $date = $nowUtc.ToString('o'); $size = 0
    if ($present.Count -gt 0) {
      $newest = $present | Sort-Object { $curFiles[$_][1] } -Descending | Select-Object -First 1
      $by = Get-Person $curMeta[$newest].FullName $people
      $date = $curFiles[$newest][1]
      foreach ($r in $present) { $size += [long]$curFiles[$r][0] }
      $owners[$key] = $by
    } elseif ($owners.ContainsKey($key)) {
      $by = $owners[$key]
    }

    $ev = [ordered]@{
      id = New-EventId; date = $date; kind = ''; category = $cat; title = ''; detail = ''
      path = $info.Dir; name = $info.Name; key = $key; by = $by; count = 1; size = $size; saves = 1
      backfill = $isBaseline
    }

    if ($info.Seq) {
      if ($present.Count -gt 0) {
        $frames = @($present | ForEach-Object { (Get-KeyInfo $_).Frame } | Sort-Object)
        $ev.kind = 'render'
        $ev.count = $present.Count
        $ev.title = "Rendered $($info.Name)"
        $ev.detail = "$($present.Count) frames ($($frames[0])-$($frames[-1]))"
        if ($g.deleted.Count -gt 0 -and $g.added.Count -eq 0 -and $g.modified.Count -eq 0) {
          $ev.title = "Removed frames from $($info.Name)"
          $ev.detail = "$($g.deleted.Count) frames removed, $($present.Count) left"
        }
      } else {
        $ev.kind = 'deleted'
        $ev.count = $g.deleted.Count
        $ev.title = "Deleted render $($info.Name)"
        $ev.detail = "$($g.deleted.Count) frames"
      }
    } else {
      if ($g.added.Count -gt 0) {
        $prev = Get-PreviousVersion $key $allRels
        if ($prev) { $ev.kind = 'version'; $ev.title = "New version: $($info.Name)"; $ev.detail = "previous: $prev" }
        else { $ev.kind = 'added'; $ev.title = "Added $($info.Name)" }
      } elseif ($g.modified.Count -gt 0) {
        $ev.kind = 'updated'; $ev.title = "Updated $($info.Name)"
      } else {
        $ev.kind = 'deleted'; $ev.title = "Deleted $($info.Name)"; $ev.date = $nowUtc.ToString('o')
      }
    }

    # Merge with a recent event for the same thing instead of adding noise
    $merged = $false
    if (-not $isBaseline -and ($ev.kind -eq 'render' -or $ev.kind -eq 'updated')) {
      foreach ($old in $events) {
        if ($old.key -ne $key) { continue }
        $oldKindOk = ($old.kind -eq $ev.kind) -or ($ev.kind -eq 'updated' -and ($old.kind -eq 'added' -or $old.kind -eq 'version'))
        $age = ($nowUtc - [DateTime]::Parse($old.date).ToUniversalTime()).TotalHours
        if ($oldKindOk -and $age -lt $MergeHours) {
          if ($ev.kind -eq 'updated') {
            $old.saves = [int]$old.saves + 1
            $suffix = "saved $($old.saves) times"
            $old.detail = if ($old.kind -eq 'version') { "$($old.detail -replace ', saved \d+ times$', ''), $suffix" } else { $suffix }
          } else {
            $old.title = $ev.title; $old.detail = $ev.detail; $old.count = $ev.count
          }
          $old.date = $ev.date; $old.size = $ev.size; $old.by = $ev.by
          $merged = $true; break
        }
      }
    }
    if (-not $merged) { [void]$newEvents.Add($ev) }
    $touched++
  }

  if ($touched -eq 0) { Write-Log 'No changes.'; exit 0 }

  # Collapse many single images added to one folder in the same scan
  $imageAdds = @($newEvents | Where-Object { $_.kind -eq 'added' -and $_.category -eq 'image' })
  foreach ($grp in ($imageAdds | Group-Object { $_.path })) {
    if ($grp.Count -lt 4) { continue }
    $first = $grp.Group | Sort-Object { $_.date } -Descending | Select-Object -First 1
    $folder = if ($grp.Name) { Split-Path -Leaf $grp.Name } else { '04. 3D' }
    $groupSize = [long]0
    foreach ($e in $grp.Group) { $groupSize += [long]$e.size }
    $summary = [ordered]@{
      id = New-EventId; date = $first.date; kind = 'added'; category = 'image'
      title = "Added $($grp.Count) images to $folder"; detail = (($grp.Group | Select-Object -First 4 | ForEach-Object { $_.name }) -join ', ') + ' ...'
      path = $grp.Name; name = $folder; key = "$($grp.Name)\*"; by = $first.by; count = $grp.Count
      size = $groupSize; saves = 1; backfill = $isBaseline
    }
    foreach ($e in $grp.Group) { $newEvents.Remove($e) }
    [void]$newEvents.Add($summary)
  }

  if ($isBaseline) {
    [void]$newEvents.Add([ordered]@{
      id = New-EventId; date = $nowUtc.ToString('o'); kind = 'info'; category = 'other'
      title = 'File tracking started'
      detail = "$($curFiles.Count) files already in the 3D folder. Earlier entries are dated by when each file was last modified."
      path = ''; name = ''; key = '__start__'; by = 'Tracker'; count = $curFiles.Count; size = 0; saves = 1; backfill = $false
    })
  }

  foreach ($e in $newEvents) { [void]$events.Add($e) }
  $sorted = @($events | Sort-Object { [string]$_.date } -Descending | Select-Object -First $MaxEvents)
  $list = New-Object System.Collections.ArrayList
  foreach ($e in $sorted) { [void]$list.Add($e) }

  # Write snapshot and timeline
  $filesOut = [ordered]@{}
  foreach ($k in ($curFiles.Keys | Sort-Object)) { $filesOut[$k] = $curFiles[$k] }
  $ownersOut = [ordered]@{}
  foreach ($k in ($owners.Keys | Sort-Object)) { $ownersOut[$k] = $owners[$k] }
  Write-Json $ManifestPath ([ordered]@{ root = $Root; scannedAt = $nowUtc.ToString('o'); fileCount = $curFiles.Count; files = $filesOut; owners = $ownersOut })
  Write-Json $TimelinePath ([ordered]@{ updatedAt = $nowUtc.ToString('o'); root = '04. 3D'; events = $list })

  $titles = @($newEvents | Sort-Object { [string]$_.date } -Descending | ForEach-Object { $_.title })
  if ($titles.Count -eq 0) { $titles = @('Updated existing timeline entries') }
  Write-Log ("{0} change(s): {1}" -f $touched, ($titles -join '; '))

  if ($NoGit) { exit 0 }

  $subject = if ($isBaseline) { 'Tracker: start tracking the 3D folder' } else { "Tracker: $($titles[0])" + $(if ($titles.Count -gt 1) { " (+$($titles.Count - 1) more)" } else { '' }) }
  if ($subject.Length -gt 100) { $subject = $subject.Substring(0, 97) + '...' }
  $body = ($titles | Select-Object -First 30 | ForEach-Object { "- $_" }) -join "`n"
  $msgFile = Join-Path $env:TEMP 'iktva-tracker-commit.txt'
  [System.IO.File]::WriteAllText($msgFile, "$subject`n`n$body`n`nTracked-By: 3D folder scanner`n", $Utf8NoBom)

  Invoke-Git add -- tracker/manifest.json src/content/timeline.json | Out-Null
  Invoke-Git commit -q -F $msgFile -- tracker/manifest.json src/content/timeline.json | Out-Null

  $pushed = $false
  for ($i = 1; $i -le 3 -and -not $pushed; $i++) {
    try { Invoke-Git push -q origin HEAD:main | Out-Null; $pushed = $true }
    catch { Write-Log "Push attempt $i failed; rebasing. $_"; Invoke-Git pull -q --rebase origin main | Out-Null }
  }
  if ($pushed) { Write-Log "Pushed: $subject" } else { Write-Log 'Push failed; will retry on the next scan.' }
}
catch {
  Write-Log "ERROR: $_"
  exit 1
}
finally {
  $mutex.ReleaseMutex()
}
