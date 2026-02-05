from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Loop.in API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "changethis"  # TODO: Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Defaults to localhost for dev, but MUST be overridden in production
    DATABASE_URL: str = "postgresql://postgres:password@localhost/loopin"
    
    @property
    def SQLALCHEMY_DATABASE_URL(self) -> str:
        url = self.DATABASE_URL
        if url and url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        
        # Log (masked) URL during property access for debugging startup
        if "localhost" in url:
            import warnings
            warnings.warn("DATABASE_URL is still pointing to localhost. Ensure environment variables are set in Render/Production.")
        
        return url

    # Production Frontend URL for CORS
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:3000/auth/callback"
    
    # Firebase
    FIREBASE_CREDENTIALS_JSON: str | None = None

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
