# ISE Health Console -- Startup Guard Registration
# Run once as your normal user (no admin needed):
#   powershell -ExecutionPolicy Bypass -File register_startup.ps1
#
# To verify the task was registered:
#   Get-ScheduledTask -TaskName "ISE Health Console Startup"
#
# To manually trigger it now without rebooting:
#   Start-ScheduledTask -TaskName "ISE Health Console Startup"

$taskName   = "ISE Health Console Startup"
$nodeExe    = (Get-Command node -ErrorAction Stop).Source
$scriptPath = Join-Path $PSScriptRoot "server.cjs"
$workDir    = $PSScriptRoot

Write-Host ""
Write-Host "  ISE Health Console -- Startup Guard"
Write-Host "  Registering Task Scheduler job..."
Write-Host ""

# Remove existing task if already registered (idempotent - safe to re-run)
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

$action   = New-ScheduledTaskAction `
              -Execute $nodeExe `
              -Argument """$scriptPath""" `
              -WorkingDirectory $workDir

$trigger  = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME

$settings = New-ScheduledTaskSettingsSet `
              -Hidden `
              -ExecutionTimeLimit (New-TimeSpan -Hours 23) `
              -RestartCount 3 `
              -RestartInterval (New-TimeSpan -Minutes 2) `
              -StartWhenAvailable

$principal = New-ScheduledTaskPrincipal `
               -UserId $env:USERNAME `
               -LogonType Interactive `
               -RunLevel Limited

Register-ScheduledTask `
  -TaskName   $taskName `
  -Action     $action `
  -Trigger    $trigger `
  -Settings   $settings `
  -Principal  $principal `
  -Description "Auto-starts ISE Health Console server on login -- Prime Pathwy Sovereign Systems" `
  -Force | Out-Null

Write-Host "  [OK] Startup Guard registered: $taskName"
Write-Host "  The server will auto-start silently on every login."
Write-Host ""
Write-Host "  To start it right now without rebooting, run:"
Write-Host "    Start-ScheduledTask -TaskName 'ISE Health Console Startup'"
Write-Host ""
