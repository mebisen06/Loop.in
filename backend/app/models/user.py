from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # Nullable for OAuth users
    is_active = Column(Boolean, default=True)
    enrollment_number = Column(String, unique=True, index=True, nullable=True) # Nullable for legacy, enforced in API
    auth_provider = Column(String, default="local")  # "local" or "google"
    
    # Profile Fields
    username = Column(String, unique=True, index=True, nullable=True) # Enforce uniqueness in API
    full_name = Column(String, nullable=True)
    department = Column(String, nullable=True)
    role = Column(String, default="student") # student, faculty, admin
    bio = Column(String, nullable=True)
    profile_photo_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
