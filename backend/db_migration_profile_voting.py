from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate_db():
    print(f"Connecting to {settings.DATABASE_URL}...")
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as connection:
        try:
            # 1. Update Users Table
            print("Checking/Updating 'users' table...")
            columns = [
                ("username", "VARCHAR"),
                ("full_name", "VARCHAR"),
                ("department", "VARCHAR"),
                ("role", "VARCHAR DEFAULT 'student'"),
                ("bio", "VARCHAR"),
                ("profile_photo_url", "VARCHAR"),
                ("created_at", "TIMESTAMP DEFAULT NOW()")
            ]
            
            for col_name, col_type in columns:
                # Check if column exists
                check_sql = text(f"SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='{col_name}';")
                if not connection.execute(check_sql).fetchone():
                    print(f"  Adding column '{col_name}'...")
                    connection.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type};"))
                    if col_name == "username":
                        connection.execute(text("CREATE UNIQUE INDEX ix_users_username ON users (username);"))

            # 2. Update Posts Table (Votes)
            print("Checking/Updating 'posts' table...")
            vote_cols = [
                ("upvotes", "INTEGER DEFAULT 0"),
                ("downvotes", "INTEGER DEFAULT 0")
            ]
            for col_name, col_type in vote_cols:
                check_sql = text(f"SELECT column_name FROM information_schema.columns WHERE table_name='posts' AND column_name='{col_name}';")
                if not connection.execute(check_sql).fetchone():
                    print(f"  Adding column '{col_name}'...")
                    connection.execute(text(f"ALTER TABLE posts ADD COLUMN {col_name} {col_type};"))

            # 3. Update Comments Table (Votes)
            print("Checking/Updating 'comments' table...")
            for col_name, col_type in vote_cols:
                check_sql = text(f"SELECT column_name FROM information_schema.columns WHERE table_name='comments' AND column_name='{col_name}';")
                if not connection.execute(check_sql).fetchone():
                    print(f"  Adding column '{col_name}'...")
                    connection.execute(text(f"ALTER TABLE comments ADD COLUMN {col_name} {col_type};"))

            # 4. Create Votes Table (if not exists)
            print("Checking 'votes' table...")
            check_table_sql = text("SELECT to_regclass('public.votes');")
            if not connection.execute(check_table_sql).fetchone()[0]:
                print("  Creating 'votes' table...")
                # We can rely on SQLAlchemy create_all usually, but here we do it manually to be safe or just let the main app handle it if we restart.
                # Actually, main app `create_tables` only creates if not exists.
                # Let's create it explicitly here to be super sure including constraints.
                connection.execute(text("""
                    CREATE TABLE votes (
                        id SERIAL PRIMARY KEY,
                        user_id INTEGER NOT NULL REFERENCES users(id),
                        post_id INTEGER REFERENCES posts(id),
                        comment_id INTEGER REFERENCES comments(id),
                        vote_type INTEGER NOT NULL
                    );
                """))
                connection.execute(text("CREATE INDEX ix_votes_id ON votes (id);"))
                connection.execute(text("CREATE UNIQUE INDEX unique_user_post_vote ON votes (user_id, post_id) WHERE post_id IS NOT NULL;"))
                connection.execute(text("CREATE UNIQUE INDEX unique_user_comment_vote ON votes (user_id, comment_id) WHERE comment_id IS NOT NULL;"))

            connection.commit()
            print("Migration successful!")
        except Exception as e:
            print(f"Migration failed or partially applied: {e}")
            connection.rollback()

if __name__ == "__main__":
    migrate_db()
