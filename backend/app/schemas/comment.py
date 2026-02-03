from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict
from app.schemas.reaction import ReactionResponse

class CommentBase(BaseModel):
    content: str
    
class CommentCreate(CommentBase):
    pass

class CommentUpdate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    post_id: int
    author_id: Optional[int]
    parent_id: Optional[int]
    created_at: datetime
    
    # We will compute these or fetch them
    replies: List['Comment'] = []
    reactions: List[ReactionResponse] = []
    
    # Vote info
    upvotes: int = 0
    downvotes: int = 0
    user_vote: Optional[int] = None

    class Config:
        from_attributes = True

Comment.model_rebuild()
