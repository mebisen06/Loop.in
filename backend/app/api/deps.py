from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import firebase_admin
from firebase_admin import auth, credentials
import os
import json
import random

from app.db.session import get_db
from app.models.user import User

# Initialize Firebase Admin (Singleton)
from app.core.config import settings

# Initialize Firebase Admin (Singleton)
if not firebase_admin._apps:
    cred_path = settings.FIREBASE_CREDENTIALS_JSON
    if cred_path:
        # Check if it's a file path or JSON string
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
        else:
            # Try parsing as JSON string (handle potential escaped quotes and whitespace)
            try:
                # Clean the string if it was wrapped in extra quotes by env vars
                cleaned_path = cred_path.strip().strip("'").strip('"')
                if not cleaned_path:
                    print("WARNING: FIREBASE_CREDENTIALS_JSON is empty.")
                    cred = None
                else:
                    cred_dict = json.loads(cleaned_path)
                    cred = credentials.Certificate(cred_dict)
            except Exception as e:
                print(f"WARNING: FIREBASE_CREDENTIALS_JSON is invalid. Error: {e}")
                cred = None
        
        if cred:
            try:
                firebase_admin.initialize_app(cred)
                print("Firebase Admin successfully initialized.")
            except Exception as e:
                print(f"ERROR: Failed to initialize Firebase app: {e}")
    else:
        print("WARNING: FIREBASE_CREDENTIALS_JSON not set. Firebase Auth verification will fail.")

security = HTTPBearer()

def get_current_user(
    db: Session = Depends(get_db),
    token: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # 1. Try Local JWT (Custom Auth)
        from jose import jwt, JWTError
        try:
            payload = jwt.decode(token.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            email: str = payload.get("sub")
            if email:
                user = db.query(User).filter(User.email == email).first()
                if user:
                    return user
        except JWTError:
            # Not a local token, fall through to Firebase
            pass

        # 2. Verify Firebase Token
        decoded_token = auth.verify_id_token(token.credentials)
        uid = decoded_token['uid']
        email = decoded_token.get('email')
        
        if not email:
             raise HTTPException(status_code=400, detail="User email not found in token")

    except Exception as e:
        print(f"Auth Error Details: {str(e)}")
        import traceback
        traceback.print_exc()
        raise credentials_exception



    # Lazy Registration (Find or Create User)
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Create new user automatically
        print(f"Creating new user for {email}")
        base_username = email.split("@")[0]
        # Sanitize username
        base_username = "".join(c for c in base_username if c.isalnum() or c in ['_', '-']) or "user"
        
        username = base_username
        
        # Ensure unique username
        while db.query(User).filter(User.username == username).first():
            suffix = random.randint(1000, 9999)
            username = f"{base_username}{suffix}"
            
        try:
            user = User(
                email=email,
                username=username,
                # We don't have password logic anymore, handled by Firebase
                # enrollment_number might be null initially
                full_name=decoded_token.get('name', base_username),
                profile_photo_url=decoded_token.get('picture'),
                auth_provider='firebase'
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        except Exception as db_err:
             print(f"DB Error creating user: {db_err}")
             db.rollback()
             raise HTTPException(status_code=500, detail="Failed to create user account")

    return user

def get_current_user_optional(
    db: Session = Depends(get_db),
    token: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[User]:
    if not token:
        return None
    try:
        return get_current_user(db, token)
    except HTTPException:
        return None


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Guard: Enforces 'admin' role.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Antigravity Protocol: Access Denied. This sector is restricted to Team Codality High Command.",
        )
    return current_user
