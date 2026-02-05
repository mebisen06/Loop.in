"""
# Reload Trigger
FastAPI application entry point with proper lifecycle management.

This module sets up:
- FastAPI app with lifespan events
- CORS middleware
- API routes
- Health check endpoint
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import init_db, create_tables, close_db
from app.api import auth

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    
    Handles startup and shutdown events:
    - Startup: Initialize database connection and create tables
    - Shutdown: Close database connections
    """
    # Startup
    logger.info("Starting application...")
    
    db_url = settings.SQLALCHEMY_DATABASE_URL
    if "@" in db_url:
        host = db_url.split("@")[1].split("/")[0]
        logger.info(f"Connecting to database host: {host}")
    else:
        logger.info("Connecting to database: (URL format not masked)")
    
    try:
        # Initialize database
        init_db(db_url)
        logger.info("Database engine initialized")
        
        # Create tables
        create_tables()
        logger.info("Database tables created/verified")
        
        logger.info("Application startup complete")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise
    
    yield  # Application runs here
    
    # Shutdown
    logger.info("Shutting down application...")
    close_db()
    logger.info("Database connections closed")
    logger.info("Application shutdown complete")


# Create FastAPI app with lifespan
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS middleware - Allow production frontend or all in development
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if settings.FRONTEND_URL != "http://localhost:3000" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Health check endpoint
@app.get("/health", tags=["health"])
def health_check():
    """
    Health check endpoint.
    
    Returns:
        {"status": "ok"}
    """
    return {"status": "ok"}


# Include API routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
from app.api import posts, comments, reactions, users, votes

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(posts.router, prefix="/posts", tags=["posts"])
app.include_router(comments.router, prefix="/posts/{post_id}/comments", tags=["comments"])
app.include_router(reactions.router, prefix="/reactions", tags=["reactions"])
app.include_router(votes.router, prefix="/votes", tags=["votes"])

from fastapi import WebSocket, WebSocketDisconnect
from app.core.socket_manager import manager

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket, client_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)

# Notifications
# Notifications
from app.api import notifications, news
app.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
app.include_router(news.router, prefix="/news", tags=["news"])
