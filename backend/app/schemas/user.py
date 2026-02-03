from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    enrollment_number: Optional[str] = None
    is_active: Optional[bool] = True

class UserBasic(BaseModel):
    id: int
    email: EmailStr
    enrollment_number: Optional[str] = None

    class Config:
        from_attributes = True
