from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Ghost Mode
    is_anonymous = Column(Boolean, default=False)
    
    # Vote Counts (Cached)
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    
    # Author (optional for now, can be linked to User if we enforce auth)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    author = relationship("User", backref="posts")

    # Extra fields for this app
    department = Column(String, nullable=False)
    tags = Column(String, nullable=True) # Comma separated tags
    type = Column(String, default="discussion") # discussion, question, announcement
