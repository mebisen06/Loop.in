from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.user import User
from app.api.deps import get_current_user
from app.schemas.post import Post, PostCreate
from app.crud import post as crud_post

router = APIRouter()

@router.post("/", response_model=Post, status_code=status.HTTP_201_CREATED)
def create_post(
    post: PostCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Require auth to create post
):
    return crud_post.create_post(db=db, post=post, author_id=current_user.id)

@router.get("/", response_model=List[Post])
def read_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    posts = crud_post.get_posts(db, skip=skip, limit=limit)
    return posts

@router.get("/{post_id}", response_model=Post)
def read_post(post_id: int, db: Session = Depends(get_db)):
    db_post = crud_post.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Require auth
):
    post = crud_post.get_post(db, post_id=post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Strict ownership check
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this post")
        
    crud_post.delete_post(db=db, post_id=post_id)
    return None
