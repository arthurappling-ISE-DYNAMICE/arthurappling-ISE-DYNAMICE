$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("C:\Users\arthu\Desktop\ISE_HEALTH_MONITOR.lnk")
$Shortcut.TargetPath = "C:\Users\arthu\GeminiEcosystem\ISE_Health_Console\shortcut.bat"
$Shortcut.WorkingDirectory = "C:\Users\arthu\GeminiEcosystem\ISE_Health_Console"
$Shortcut.Description = "ISE Health Console — Daily Monitoring Dashboard"
$Shortcut.IconLocation = "%SystemRoot%\System32\shell32.dll,21"
$Shortcut.WindowStyle = 1
$Shortcut.Save()
Write-Host "Desktop shortcut created: ISE_HEALTH_MONITOR"
