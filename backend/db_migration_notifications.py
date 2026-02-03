from sqlalchemy import create_engine
from app.core.config import settings
from app.db.session import Base
# Import all models to ensure they are registered
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.notification import Notification

def run_migration():
    print("Initializing database engine locally for migration...")
    # Create a local engine instance just for this script
    engine = create_engine(settings.DATABASE_URL)
    
    print("Creating all tables (including notifications)...")
    Base.metadata.create_all(bind=engine)
    print("Migration completed successfully!")

if __name__ == "__main__":
    run_migration()
