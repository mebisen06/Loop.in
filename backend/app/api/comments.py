from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.comment import Comment, CommentCreate
from app.crud.comment import create_comment, get_comments_by_post

router = APIRouter()

@router.post("/", response_model=Comment, status_code=status.HTTP_201_CREATED)
def create_comment_endpoint(
    post_id: int, 
    comment: CommentCreate, 
    author_id: int, # Pass author_id manually for now
    parent_id: int = None,
    db: Session = Depends(get_db)
):
    return create_comment(
        db=db, 
        comment=comment, 
        post_id=post_id, 
        author_id=author_id,
        parent_id=parent_id
    )

@router.get("/", response_model=List[Comment])
def get_comments_endpoint(post_id: int, user_id: int = None, db: Session = Depends(get_db)):
    return get_comments_by_post(db=db, post_id=post_id, user_id=user_id)
