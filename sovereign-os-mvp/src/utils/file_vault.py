import os
import uuid
import magic
from src.config.settings import settings

ALLOWED_MIMES = ["application/pdf", "image/png", "image/jpeg"]

def save_to_vault(content: bytes, original_filename: str) -> tuple[str, str]:
    # Validate MIME
    mime_type = magic.from_buffer(content[:2048], mime=True)
    if mime_type not in ALLOWED_MIMES:
        raise ValueError(f"Unsupported file type: {mime_type}")
    
    # Generate secure name
    ext = ".pdf" if mime_type == "application/pdf" else ".jpg"
    if mime_type == "image/png": ext = ".png"
    
    secure_name = f"{uuid.uuid4().hex}{ext}"
    vault_path = os.path.join(settings.vault_path, secure_name)
    
    # Ensure vault exists
    os.makedirs(settings.vault_path, exist_ok=True)
    
    # Write file
    with open(vault_path, "wb") as f:
        f.write(content)
        
    # Restrict permissions
    os.chmod(vault_path, 0o600)
    
    return vault_path, mime_type
