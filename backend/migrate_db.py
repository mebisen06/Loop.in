from app.db.session import init_db
from app.core.config import settings
from sqlalchemy import text, inspect
import app.db.session as db_session

def migrate():
    print("Initializing DB connection...")
    init_db(settings.DATABASE_URL)

    print("Starting migration check...")
    inspector = inspect(db_session.engine)
    columns = [col['name'] for col in inspector.get_columns('posts')]
    
    if 'is_anonymous' not in columns:
        print("Adding 'is_anonymous' column to posts table...")
        with db_session.engine.connect() as conn:
            conn.execute(text("ALTER TABLE posts ADD COLUMN is_anonymous BOOLEAN DEFAULT 0"))
            conn.commit()
        print("Migration successful: 'is_anonymous' added.")
    else:
        print("Migration skipped: 'is_anonymous' already exists.")

if __name__ == "__main__":
    migrate()
