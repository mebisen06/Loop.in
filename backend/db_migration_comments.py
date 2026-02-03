from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate_db():
    print(f"Connecting to {settings.DATABASE_URL}...")
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            print("Checking/Updating 'posts' table...")
            # Check if column exists
            check_sql = text("SELECT column_name FROM information_schema.columns WHERE table_name='posts' AND column_name='comments_count';")
            if not connection.execute(check_sql).fetchone():
                print("  Adding column 'comments_count'...")
                connection.execute(text("ALTER TABLE posts ADD COLUMN comments_count INTEGER DEFAULT 0;"))
                
                # Optional: Backfill existing counts
                print("  Backfilling existing comment counts...")
                connection.execute(text("""
                    UPDATE posts 
                    SET comments_count = (
                        SELECT COUNT(*) 
                        FROM comments 
                        WHERE comments.post_id = posts.id
                    );
                """))
                
                connection.commit()
                print("Migration successful: Added comments_count and backfilled data.")
            else:
                print("Column 'comments_count' already exists.")
                
        except Exception as e:
            print(f"Migration failed or partially applied: {e}")
            connection.rollback()

if __name__ == "__main__":
    migrate_db()
