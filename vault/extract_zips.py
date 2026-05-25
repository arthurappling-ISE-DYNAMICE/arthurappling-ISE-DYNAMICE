import zipfile, os, re, sys

def safe_name(name):
    return re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', name)

pairs = [
    (r'C:\Users\arthu\GeminiEcosystem\vault\arch_plan_1.zip',
     r'C:\Users\arthu\GeminiEcosystem\vault\zip_extract_1'),
    (r'C:\Users\arthu\GeminiEcosystem\vault\arch_plan_2.zip',
     r'C:\Users\arthu\GeminiEcosystem\vault\zip_extract_2'),
]

for zip_path, out_dir in pairs:
    os.makedirs(out_dir, exist_ok=True)
    with zipfile.ZipFile(zip_path, 'r') as zf:
        for item in zf.infolist():
            safe = safe_name(item.filename)
            dest = os.path.join(out_dir, safe)
            if item.is_dir():
                os.makedirs(dest, exist_ok=True)
            else:
                os.makedirs(os.path.dirname(dest), exist_ok=True)
                with zf.open(item) as src, open(dest, 'wb') as dst:
                    dst.write(src.read())
                print(f'WRITTEN: {safe}')
    print(f'DONE: {zip_path}')
