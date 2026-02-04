from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.user import UserBasic


class PostBase(BaseModel):
    title: str
    content: str
    department: str
    type: str = "discussion"
    tags: Optional[str] = None
    is_anonymous: bool = False

class PostCreate(PostBase):
    pass

class PostUpdate(PostBase):
    title: Optional[str] = None
    content: Optional[str] = None
    department: Optional[str] = None
    type: Optional[str] = None

class Post(PostBase):
    id: int
    created_at: datetime
    author_id: Optional[int] = None
    author: Optional[UserBasic] = None
    
    # Vote info
    upvotes: int = 0
    downvotes: int = 0
    comments_count: int = 0
    user_vote: Optional[int] = None # 1, -1, or None (if not voted)
    
    class Config:
        from_attributes = True
