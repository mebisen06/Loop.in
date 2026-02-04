from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from starlette.background import BackgroundTasks

from app.db.session import get_db
from app.schemas.comment import Comment, CommentCreate
from app.crud.comment import create_comment, get_comments_by_post
from app.api.deps import get_current_user
from app.models.user import User
from app.models.post import Post
from app.models.notification import Notification
from app.models.comment import Comment as CommentModel
from app.core.socket_manager import manager

router = APIRouter()

async def send_notification_ws(user_id: int, message: dict):
    await manager.send_personal_message(message, user_id)

@router.post("/", response_model=Comment, status_code=status.HTTP_201_CREATED)
async def create_comment_endpoint(
    post_id: int, 
    comment: CommentCreate, 
    background_tasks: BackgroundTasks,
    parent_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_comment = create_comment(
        db=db, 
        comment=comment, 
        post_id=post_id, 
        author_id=current_user.id,
        parent_id=parent_id
    )
    
    # Increment comment count
    post = db.query(Post).filter(Post.id == post_id).first()
    if post:
        post.comments_count += 1
        db.commit()
        
        # Notify Post Author (if not self)
        if post.author_id != current_user.id:
            # Create DB Notification
            notif = Notification(
                recipient_id=post.author_id,
                sender_id=current_user.id,
                type="comment",
                title="New Comment",
                message=f"{current_user.full_name} commented on your post",
                reference_id=post.id,
                reference_type="post",
                created_at=datetime.utcnow()
            )
            db.add(notif)
            db.commit()
            
            # Real-time Send
            background_tasks.add_task(send_notification_ws, post.author_id, {
                "type": "comment",
                "title": "New Comment",
                "message": f"{current_user.full_name} commented on your post",
                "reference_id": post.id,
                "sender": {
                    "name": current_user.full_name,
                    "profile_photo": current_user.profile_photo_url
                },
                "created_at": datetime.utcnow().isoformat()
            })

    return new_comment

@router.get("/", response_model=List[Comment])
def get_comments_endpoint(post_id: int, user_id: int = None, db: Session = Depends(get_db)):
    return get_comments_by_post(db=db, post_id=post_id, user_id=user_id)

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment_endpoint(
    post_id: int,
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = db.query(CommentModel).filter(CommentModel.id == comment_id, CommentModel.post_id == post_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
        
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
        
    db.delete(comment)
    
    # Decrement comment count
    post = db.query(Post).filter(Post.id == post_id).first()
    if post and post.comments_count > 0:
        post.comments_count -= 1
        
    db.commit()
    return None
