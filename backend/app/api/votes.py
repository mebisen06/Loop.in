from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.vote import Vote, VoteType
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.api.deps import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class VoteRequest(BaseModel):
    post_id: Optional[int] = None
    comment_id: Optional[int] = None
    vote_type: int # 1 or -1

from starlette.background import BackgroundTasks
from app.models.notification import Notification
from app.core.socket_manager import manager
from datetime import datetime

async def send_vote_notification(user_id: int, message: dict):
    await manager.send_personal_message(message, user_id)

@router.post("/")
async def cast_vote(
    vote_data: VoteRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validation
    if not vote_data.post_id and not vote_data.comment_id:
        raise HTTPException(status_code=400, detail="Must provide post_id or comment_id")
    
    if vote_data.post_id and vote_data.comment_id:
        raise HTTPException(status_code=400, detail="Cannot vote on both post and comment at once")
        
    if vote_data.vote_type not in [1, -1]:
        raise HTTPException(status_code=400, detail="Invalid vote type. Use 1 for upvote, -1 for downvote")

    # Check existence
    model = Post if vote_data.post_id else Comment
    target_id = vote_data.post_id if vote_data.post_id else vote_data.comment_id
    
    target = db.query(model).filter(model.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")

    # Check existing vote
    existing_vote = db.query(Vote).filter(
        Vote.user_id == current_user.id,
        Vote.post_id == vote_data.post_id,
        Vote.comment_id == vote_data.comment_id
    ).first()

    if existing_vote:
        if existing_vote.vote_type == vote_data.vote_type:
            # Remove vote (toggle off)
            db.delete(existing_vote)
            
            # Update cache
            if vote_data.vote_type == 1:
                target.upvotes -= 1
            else:
                target.downvotes -= 1
                
            db.commit()
            return {"status": "removed", "upvotes": target.upvotes, "downvotes": target.downvotes}
        else:
            # Switch vote
            old_type = existing_vote.vote_type
            existing_vote.vote_type = vote_data.vote_type
            
            # Update cache
            if old_type == 1:
                target.upvotes -= 1
                target.downvotes += 1
            else:
                target.downvotes -= 1
                target.upvotes += 1
            
            db.commit()
            return {"status": "switched", "upvotes": target.upvotes, "downvotes": target.downvotes}
    else:
        # Create new vote
        new_vote = Vote(
            user_id=current_user.id,
            post_id=vote_data.post_id,
            comment_id=vote_data.comment_id,
            vote_type=vote_data.vote_type
        )
        db.add(new_vote)
        
        # Update cache
        if vote_data.vote_type == 1:
            target.upvotes += 1
            
            # Notify Author (if Post and not self)
            if vote_data.post_id and model == Post and target.author_id != current_user.id:
                # Check for existing notification to prevent spam
                existing = db.query(Notification).filter(
                    Notification.recipient_id == target.author_id,
                    Notification.sender_id == current_user.id,
                    Notification.type == "upvote",
                    Notification.reference_id == target.id
                ).first()
                
                if not existing:
                    notif = Notification(
                        recipient_id=target.author_id,
                        sender_id=current_user.id,
                        type="upvote",
                        title="New Upvote",
                        message=f"{current_user.full_name} upvoted your post",
                        reference_id=target.id,
                        reference_type="post",
                        created_at=datetime.utcnow()
                    )
                    db.add(notif)
                    # We commit at end, so it's fine.
                    
                    background_tasks.add_task(send_vote_notification, target.author_id, {
                        "type": "upvote",
                        "title": "New Upvote",
                        "message": f"{current_user.full_name} upvoted your post",
                        "reference_id": target.id,
                        "sender": {
                            "name": current_user.full_name
                        },
                        "created_at": datetime.utcnow().isoformat()
                    })

        else:
            target.downvotes += 1
            
        db.commit()
        return {"status": "added", "upvotes": target.upvotes, "downvotes": target.downvotes}
