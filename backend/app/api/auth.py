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
    username: str

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
        
    # Check if username exists
    if db.query(User).filter(User.username == user_in.username).first():
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )

    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email, 
        hashed_password=hashed_password,
        enrollment_number=user_in.enrollment_number,
        username=user_in.username
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
        "enrollment_number": current_user.enrollment_number,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "department": current_user.department,
        "role": current_user.role,
        "bio": current_user.bio,
        "profile_photo_url": current_user.profile_photo_url,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None
    }

# --- Google OAuth ---

class GoogleAuthRequest(BaseModel):
    code: str

@router.post("/google", response_model=Token)
async def google_auth(auth_request: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Exchange Google OAuth code for access token.
    Frontend sends the code received from Google redirect.
    """
    import httpx
    
    # Exchange code for tokens
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": auth_request.code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    
    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data=token_data)
        
    if token_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange Google code for token"
        )
    
    tokens = token_response.json()
    access_token_google = tokens.get("access_token")
    
    # Fetch user info from Google
    userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
    async with httpx.AsyncClient() as client:
        userinfo_response = await client.get(
            userinfo_url,
            headers={"Authorization": f"Bearer {access_token_google}"}
        )
    
    if userinfo_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to fetch Google user info"
        )
    
    google_user = userinfo_response.json()
    email = google_user.get("email")
    name = google_user.get("name")
    picture = google_user.get("picture")
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account has no email"
        )
    
    # Upsert user (find or create)
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Create new user
        user = User(
            email=email,
            full_name=name,
            profile_photo_url=picture,
            auth_provider="google",
            hashed_password=None  # No password for OAuth users
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update profile photo if changed
        if picture and user.profile_photo_url != picture:
            user.profile_photo_url = picture
            db.commit()
    
    # Issue our JWT
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/google/url")
def get_google_auth_url():
    """
    Returns the Google OAuth URL for the frontend to redirect to.
    """
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.GOOGLE_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=email%20profile"
        f"&access_type=offline"
        f"&prompt=consent"
    )
    return {"url": google_auth_url}
