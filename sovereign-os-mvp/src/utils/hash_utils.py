import hashlib

def calculate_hash(content: bytes) -> str:
    sha256 = hashlib.sha256()
    sha256.update(content)
    return sha256.hexdigest()
