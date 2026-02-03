from pydantic import BaseModel
from typing import Optional

class ReactionCreate(BaseModel):
    user_id: int # In a real app, this comes from token
    emoji: str
    target_type: str # 'post' or 'comment'
    target_id: int

class ReactionResponse(BaseModel):
    emoji: str
    count: int
    user_reacted: bool = False

class ReactionBase(BaseModel):
    emoji: str

class Reaction(ReactionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
