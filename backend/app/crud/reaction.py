from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.reaction import Reaction

def toggle_reaction(db: Session, user_id: int, emoji: str, target_type: str, target_id: int):
    # Determine columns
    post_id = target_id if target_type == 'post' else None
    comment_id = target_id if target_type == 'comment' else None
    
    # Check if exists
    query = db.query(Reaction).filter(
        Reaction.user_id == user_id,
        Reaction.emoji == emoji
    )
    if post_id:
        query = query.filter(Reaction.post_id == post_id)
    else:
        query = query.filter(Reaction.comment_id == comment_id)
        
    existing = query.first()
    
    if existing:
        db.delete(existing)
        db.commit()
        return None # Removed
    
    # Create
    new_reaction = Reaction(
        user_id=user_id,
        emoji=emoji,
        post_id=post_id,
        comment_id=comment_id
    )
    db.add(new_reaction)
    db.commit()
    return new_reaction

def get_reaction_counts(db: Session, target_type: str, target_id: int, user_id: int = None):
    # Group by emoji
    query = db.query(Reaction.emoji, func.count(Reaction.id))
    if target_type == 'post':
        query = query.filter(Reaction.post_id == target_id)
    else:
        query = query.filter(Reaction.comment_id == target_id)
    
    counts = query.group_by(Reaction.emoji).all()
    
    # Check user reactions
    user_reactions = set()
    if user_id:
        u_query = db.query(Reaction.emoji).filter(Reaction.user_id == user_id)
        if target_type == 'post':
            u_query = u_query.filter(Reaction.post_id == target_id)
        else:
            u_query = u_query.filter(Reaction.comment_id == target_id)
        user_reactions = {r[0] for r in u_query.all()}

    return [
        {"emoji": emoji, "count": count, "user_reacted": emoji in user_reactions}
        for emoji, count in counts
    ]
