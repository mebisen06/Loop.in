from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Vote Counts (Cached)
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    
    # Relationships
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    
    post = relationship("Post", backref="comments")
    author = relationship("User", backref="comments")
    parent = relationship("Comment", remote_side=[id], backref="replies")
    
    # Reactions relationship
    reactions = relationship("Reaction", backref="comment", foreign_keys="Reaction.comment_id")

# Add reactions relationship to Post as well
from app.models.post import Post
Post.reactions = relationship("Reaction", backref="post", foreign_keys="Reaction.post_id")
