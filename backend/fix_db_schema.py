from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate_db():
    print(f"Connecting to {settings.DATABASE_URL}...")
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as connection:
        # Check if column exists first to avoid error
        try:
            # PostgreSQL specific check
            result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='enrollment_number';"))
            if result.fetchone():
                print("Column 'enrollment_number' already exists.")
                return

            print("Adding 'enrollment_number' column to 'users' table...")
            connection.execute(text("ALTER TABLE users ADD COLUMN enrollment_number VARCHAR;"))
            connection.execute(text("CREATE UNIQUE INDEX ix_users_enrollment_number ON users (enrollment_number);"))
            connection.commit()
            print("Migration successful: Added enrollment_number column.")
        except Exception as e:
            print(f"Migration failed or already applied: {e}") 

if __name__ == "__main__":
    migrate_db()
