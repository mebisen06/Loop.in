from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.db.session import get_db
from app.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user
from datetime import timedelta
from app.core.config import settings

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    enrollment_number: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Check if enrollment number exists
    if db.query(User).filter(User.enrollment_number == user_in.enrollment_number).first():
        raise HTTPException(
            status_code=400,
            detail="Enrollment number already registered"
        )

    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email, 
        hashed_password=hashed_password,
        enrollment_number=user_in.enrollment_number
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

class EnrollmentUpdate(BaseModel):
    enrollment_number: str

@router.put("/me/enrollment", response_model=dict)
def update_enrollment(
    info: EnrollmentUpdate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.enrollment_number:
         raise HTTPException(
            status_code=400,
            detail="Enrollment number already set"
        )

    # Check uniqueness
    if db.query(User).filter(User.enrollment_number == info.enrollment_number).first():
         raise HTTPException(
            status_code=400,
            detail="Enrollment number already registered"
        )
    
    current_user.enrollment_number = info.enrollment_number
    db.commit()
    return {"message": "Enrollment number updated"}

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
@router.get("/me", response_model=dict)
def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "enrollment_number": current_user.enrollment_number
    }
