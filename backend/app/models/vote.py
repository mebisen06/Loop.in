from sqlalchemy import Column, Integer, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.session import Base
import enum

class VoteType(int, enum.Enum):
    UPVOTE = 1
    DOWNVOTE = -1

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
    comment_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    vote_type = Column(Integer, nullable=False) # 1 for upvote, -1 for downvote

    # Relationships
    user = relationship("User", backref="votes")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'post_id', name='unique_user_post_vote'),
        UniqueConstraint('user_id', 'comment_id', name='unique_user_comment_vote'),
    )
