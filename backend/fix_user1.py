from sqlalchemy.orm import Session
from app.db import session
from app.models.user import User
from app.core.config import settings
from app.core.security import get_password_hash

def fix_user_one():
    print("Initializing DB...")
    session.init_db(settings.DATABASE_URL)
    db = session.SessionLocal()
    try:
        user = db.query(User).filter(User.id == 1).first()
        if user:
            print(f"User 1 found: {user.email}")
            new_hash = get_password_hash("password123")
            user.hashed_password = new_hash
            db.commit()
            print("User 1 password updated to 'password123' (valid bcrypt hash).")
        else:
            print("User 1 not found.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_user_one()
