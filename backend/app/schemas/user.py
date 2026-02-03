from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    enrollment_number: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    department: Optional[str] = None
    role: str = "student"
    bio: Optional[str] = None
    profile_photo_url: Optional[str] = None
    is_active: Optional[bool] = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    department: Optional[str] = None
    profile_photo_url: Optional[str] = None
    username: Optional[str] = None

class UserBasic(BaseModel):
    id: int
    email: EmailStr
    username: Optional[str] = None
    full_name: Optional[str] = None
    profile_photo_url: Optional[str] = None
    role: str = "student"
    enrollment_number: Optional[str] = None

    class Config:
        from_attributes = True
