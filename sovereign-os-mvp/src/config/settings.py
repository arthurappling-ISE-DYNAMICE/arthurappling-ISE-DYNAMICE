from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    environment: str = "local"
    api_key: str
    database_url: str = "sqlite+aiosqlite:///./prime_pathwy.db"
    vault_path: str = "./vault"

    class Config:
        env_file = ".env"

settings = Settings()
