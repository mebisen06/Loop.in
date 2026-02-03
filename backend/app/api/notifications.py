from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.api import deps
from app.models.notification import Notification
from app.models.user import User
from app.core.socket_manager import manager

router = APIRouter()

# WebSocket Endpoint
@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    # In a real app, validation via token is better inside `connect` or dependency
    # For prototype, we trust the param but we could verify if user exists
    await manager.connect(websocket, user_id)
    try:
        while True:
            # Keep alive / listen for client messages (e.g. "mark_read")
            data = await websocket.receive_text()
            # For now we just echo or ignore. 
            # Real implementation might handle client ack.
            pass
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

# API Endpoints

@router.get("/", response_model=List[dict])
def get_notifications(
    skip: int = 0, 
    limit: int = 20, 
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Fetch paginated notifications for the current user.
    """
    notifications = db.query(Notification)\
        .filter(Notification.recipient_id == current_user.id)\
        .order_by(Notification.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    # Transform for frontend - Include sender info
    result = []
    for n in notifications:
        result.append({
            "id": n.id,
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "reference_id": n.reference_id,
            "reference_type": n.reference_type,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat(),
            "sender": {
                "id": n.sender.id,
                "name": n.sender.full_name,
                "profile_photo": n.sender.profile_photo_url
            } if n.sender else None
        })
    return result

@router.put("/{notification_id}/read")
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.recipient_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notification.is_read = True
    db.commit()
    return {"status": "success"}

@router.put("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    db.query(Notification).filter(
        Notification.recipient_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"status": "success"}

@router.post("/announcement")
async def create_announcement(
    title: str,
    message: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Admin only: Create announcement for all users.
    For this prototype, we'll allow any logged in user or check a role if available.
    """
    # Quick role check if role exists
    if hasattr(current_user, 'role') and current_user.role != 'admin':
         # Allow faculty too? For now, loose permission or strict 'admin'
         if current_user.role != 'faculty': # Let faculty make announcements too?
             # raise HTTPException(status_code=403, detail="Not authorized")
             pass 

    # 1. Create notifications for ALL users (except sender)
    # This can be heavy, for 1000s of users, use background task
    users = db.query(User).filter(User.id != current_user.id).all()
    
    notifications = []
    for user in users:
        n = Notification(
            recipient_id=user.id,
            sender_id=current_user.id,
            type="announcement",
            title=title,
            message=message,
            reference_type="announcement",
            created_at=datetime.utcnow()
        )
        notifications.append(n)
    
    db.add_all(notifications)
    db.commit()
    
    # 2. Broadcast via WebSocket
    await manager.broadcast({
        "type": "announcement",
        "title": title,
        "message": message,
        "sender_name": current_user.full_name,
        "created_at": datetime.utcnow().isoformat()
    })
    
    return {"status": "sent", "count": len(users)}
