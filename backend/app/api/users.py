from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserBasic, UserBase, UserUpdate
from app.api.deps import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter()



@router.get("/me", response_model=UserBase)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserBase)
def update_user_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Update fields if provided
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.bio is not None:
        current_user.bio = user_update.bio
    if user_update.department is not None:
        current_user.department = user_update.department
    if user_update.profile_photo_url is not None:
        current_user.profile_photo_url = user_update.profile_photo_url
    if user_update.username is not None:
        # Check uniqueness if changed
        if user_update.username != current_user.username:
            existing = db.query(User).filter(User.username == user_update.username).first()
            if existing:
                raise HTTPException(status_code=400, detail="Username already taken")
            current_user.username = user_update.username
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/{username}", response_model=UserBasic)
def read_user_profile(
    username: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
