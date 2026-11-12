from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SAP Access Request Automation"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "postgresql+psycopg://sap_access:local-dev-only@localhost:5432/sap_access"
    secret_key: str = "development-only-change-me"
    access_token_expire_minutes: int = 30
    frontend_origins: list[str] = ["http://localhost:5173"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
