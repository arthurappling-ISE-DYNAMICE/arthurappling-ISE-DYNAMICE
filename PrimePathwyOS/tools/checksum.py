import hashlib

def generate_checksum(file_path: str, algorithm: str = 'sha256') -> str:
    """
    Generate a checksum for a file to ensure integrity.
    """
    hash_func = hashlib.new(algorithm)
    with open(file_path, 'rb') as f:
        while chunk := f.read(8192):
            hash_func.update(chunk)
    return hash_func.hexdigest()

def verify_checksum(file_path: str, expected_checksum: str, algorithm: str = 'sha256') -> bool:
    """
    Verify if a file matches the expected checksum.
    """
    return generate_checksum(file_path, algorithm) == expected_checksum
