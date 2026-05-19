$s = New-Object -ComObject WScript.Shell
$lnk = $s.CreateShortcut("C:UsersarthuDesktopISE_HEALTH_MONITOR.lnk")
$lnk.TargetPath = "C:UsersarthuGeminiEcosystemISE_Health_Consoleshortcut.bat"
$lnk.WorkingDirectory = "C:UsersarthuGeminiEcosystemISE_Health_Console"
$lnk.WindowStyle = 1
$lnk.Save()
Write-Host "Shortcut created"