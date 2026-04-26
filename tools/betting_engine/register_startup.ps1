# XERO XERO Betting Engine -- Startup Guard Registration
# Run once:
#   powershell -ExecutionPolicy Bypass -File register_startup.ps1
#
# Verify:  Get-ScheduledTask -TaskName "XERO_XERO_Betting_Engine"
# Manual:  Start-ScheduledTask  -TaskName "XERO_XERO_Betting_Engine"
# Stop:    Stop-ScheduledTask   -TaskName "XERO_XERO_Betting_Engine"

$taskName = "XERO_XERO_Betting_Engine"
$nodeExe  = (Get-Command node -ErrorAction Stop).Source
$appPath  = "C:\Users\arthu\GeminiEcosystem\tools\betting_engine\app.js"
$workDir  = "C:\Users\arthu\GeminiEcosystem\tools\betting_engine"

Write-Host ""
Write-Host "  XERO XERO Betting Engine -- Startup Guard"
Write-Host "  Registering Task Scheduler job..."
Write-Host ""

# Idempotent -- safe to re-run
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue

$action = New-ScheduledTaskAction `
            -Execute $nodeExe `
            -Argument """$appPath""" `
            -WorkingDirectory $workDir

$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME

$settings = New-ScheduledTaskSettingsSet `
              -Hidden `
              -ExecutionTimeLimit (New-TimeSpan -Hours 23) `
              -RestartCount 5 `
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
  -Description "Auto-starts XERO XERO Betting Dashboard on login -- AA Capital INC Port 3132" `
  -Force | Out-Null

Write-Host "  [OK] Startup Guard registered: $taskName"
Write-Host "  [OK] Port 3132 -- http://localhost:3132/dashboard.html"
Write-Host "  Server will auto-start silently on every login."
Write-Host ""
