from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.schemas.reaction import ReactionCreate, ReactionResponse
from app.crud.reaction import toggle_reaction

router = APIRouter()

@router.post("/", response_model=Optional[ReactionCreate]) # Returning created reaction or None if removed
def toggle_reaction_endpoint(reaction: ReactionCreate, db: Session = Depends(get_db)):
    # For now, simplistic approach. In real app, user_id comes from auth token
    return toggle_reaction(
        db=db,
        user_id=reaction.user_id,
        emoji=reaction.emoji,
        target_type=reaction.target_type,
        target_id=reaction.target_id
    )
