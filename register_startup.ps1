$TaskName = "Sovereign_Health_Startup"
$Action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-WindowStyle Hidden -Command "cd C:\Users\arthu\GeminiEcosystem\ISE_Health_Console; node server.cjs"'
$Trigger = New-ScheduledTaskTrigger -AtLogOn
Register-ScheduledTask -Action $Action -Trigger $Trigger -TaskName $TaskName -Description "Auto-starts Health Cockpit on Login" -Force
Write-Host "Startup Guard registered successfully."
