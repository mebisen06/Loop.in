"""
Database session management with proper lifecycle handling.

This module provides:
- SQLAlchemy engine with connection pooling
- Session factory for database transactions
- Base class for ORM models
- Database dependency for FastAPI routes
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from typing import Generator

# Create Base for models (no engine binding here!)
Base = declarative_base()

# Global engine and session factory (will be initialized in startup event)
engine = None
SessionLocal = None


def init_db(database_url: str) -> None:
    """
    Initialize database engine and session factory.
    
    This should ONLY be called in FastAPI startup event, never at import time.
    
    Args:
        database_url: PostgreSQL connection string
    """
    global engine, SessionLocal
    
    # Create engine with connection pooling
    engine = create_engine(
        database_url,
        pool_pre_ping=True,  # Verify connections before using
        pool_size=5,         # Max connections in pool
        max_overflow=10,     # Max extra connections
        echo=False,          # Set to True for SQL logging
    )
    
    # Create session factory
    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )


def create_tables() -> None:
    """
    Create all database tables.
    
    This should ONLY be called in FastAPI startup event after init_db().
    Imports models here to avoid circular dependencies.
    """
    # Import models here to register them with Base
    from app.models import user  # noqa: F401
    from app.models import post  # noqa: F401
    from app.models import comment  # noqa: F401
    from app.models import reaction  # noqa: F401
    
    # Create all tables
    Base.metadata.create_all(bind=engine)


def close_db() -> None:
    """
    Close database connections.
    
    This should be called in FastAPI shutdown event.
    """
    global engine
    if engine:
        engine.dispose()


def get_db() -> Generator[Session, None, None]:
    """
    Database session dependency for FastAPI routes.
    
    Usage:
        @router.get("/users")
        def get_users(db: Session = Depends(get_db)):
            return db.query(User).all()
    
    Yields:
        Database session
    """
    if SessionLocal is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
