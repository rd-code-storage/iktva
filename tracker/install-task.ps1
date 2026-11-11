<#
  Sets up the automatic animation folder tracker on this PC.

  1. Makes a dedicated clone of the repo for the tracker (default: next to this
     repo, named "iktva-auto-tracker"). The tracker resets that clone to GitHub's
     main branch before every scan, so never edit files in it by hand.
  2. Registers a Windows scheduled task, "IKTVA 3D folder tracker", that runs
     scan-3d.ps1 every 30 minutes (and at log-on) while you are logged in,
     with no window.

  Run once:   powershell -ExecutionPolicy Bypass -File tracker\install-task.ps1
  Remove:     Unregister-ScheduledTask -TaskName 'IKTVA 3D folder tracker' -Confirm:$false
#>
param(
  [string]$TrackerClone = (Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) 'iktva-auto-tracker'),
  [int]$EveryMinutes = 30,
  [string]$TaskName = 'IKTVA 3D folder tracker'
)

$ErrorActionPreference = 'Stop'
$Repo = Split-Path -Parent $PSScriptRoot

function Get-GitConfig([string]$dir, [string]$key) {
  $old = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  $v = & git -C $dir config $key 2>$null
  $ErrorActionPreference = $old
  return $v
}

if (-not (Test-Path -LiteralPath (Join-Path $TrackerClone '.git'))) {
  Write-Host "Cloning tracker copy to $TrackerClone"
  $url = Get-GitConfig $Repo 'remote.origin.url'
  & git clone -q $url $TrackerClone
  if ($LASTEXITCODE -ne 0) { throw 'git clone failed' }
}

# Commit as the same person as this repo
$name = Get-GitConfig $Repo 'user.name'
$email = Get-GitConfig $Repo 'user.email'
if ($name) { & git -C $TrackerClone config user.name $name }
if ($email) { & git -C $TrackerClone config user.email $email }

$script = Join-Path $TrackerClone 'tracker\scan-3d.ps1'
$psArgs = "-NoProfile -NonInteractive -ExecutionPolicy Bypass -File `"$script`""
# conhost --headless runs PowerShell without flashing a window
$action = New-ScheduledTaskAction -Execute 'conhost.exe' -Argument "--headless powershell.exe $psArgs" -WorkingDirectory $TrackerClone

$repeat = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes $EveryMinutes)
$logon = New-ScheduledTaskTrigger -AtLogOn -User "$env:USERDOMAIN\$env:USERNAME"
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 20) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger @($repeat, $logon) -Settings $settings -Principal $principal `
  -Description 'Scans the IKTVA 02. Animation folder on U: and pushes file activity to the project timeline (rd-code-storage/iktva). See tracker/README.md.' -Force | Out-Null

Write-Host "Scheduled task '$TaskName' registered: every $EveryMinutes minutes and at log-on."
Write-Host "Tracker clone: $TrackerClone"
Write-Host "Log: $(Join-Path $TrackerClone 'tracker\scan.log')"
