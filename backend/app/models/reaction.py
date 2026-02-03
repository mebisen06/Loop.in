from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Reaction(Base):
    __tablename__ = "reactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Optional for now as authentication is effectively optional
    
    # Polymorphic-like behavior using nullable foreign keys
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
    comment_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    
    emoji = Column(String, nullable=False) # e.g., "+1", "-1", "heart", "rocket"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", backref="reactions")
    
    # Ensure one reaction type per user per target (optional, but good practice)
    # For now, we allow multiple types of reactions, but maybe limit duplicate emojis
    __table_args__ = (
        UniqueConstraint('user_id', 'post_id', 'emoji', name='unique_user_post_emoji'),
        UniqueConstraint('user_id', 'comment_id', 'emoji', name='unique_user_comment_emoji'),
    )
