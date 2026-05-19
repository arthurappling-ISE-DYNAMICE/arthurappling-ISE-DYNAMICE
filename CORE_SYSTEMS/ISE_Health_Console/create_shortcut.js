// Windows Script Host — JScript — creates desktop shortcut
var shell = new ActiveXObject("WScript.Shell");
var desktop = shell.SpecialFolders("Desktop");
var lnk = shell.CreateShortcut(desktop + "\\ISE_HEALTH_MONITOR.lnk");
lnk.TargetPath = "C:\\Users\\arthu\\GeminiEcosystem\\ISE_Health_Console\\shortcut.bat";
lnk.WorkingDirectory = "C:\\Users\\arthu\\GeminiEcosystem\\ISE_Health_Console";
lnk.Description = "ISE Health Console";
lnk.WindowStyle = 1;
lnk.Save();
WScript.Echo("Shortcut created on Desktop: ISE_HEALTH_MONITOR");
