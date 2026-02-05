from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Loop.in API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "changethis"  # TODO: Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "postgresql://postgres:password@localhost/loopin"
    
    # Render provides 'postgres://', but SQLAlchemy requires 'postgresql://'
    @property
    def SQLALCHEMY_DATABASE_URL(self) -> str:
        if self.DATABASE_URL and self.DATABASE_URL.startswith("postgres://"):
            return self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        return self.DATABASE_URL

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
