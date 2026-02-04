from sqlalchemy.orm import Session, joinedload
from app.models.comment import Comment
from app.schemas.comment import CommentCreate
from app.crud.reaction import get_reaction_counts

def create_comment(db: Session, comment: CommentCreate, post_id: int, author_id: int, parent_id: int = None):
    db_comment = Comment(
        content=comment.content,
        post_id=post_id,
        author_id=author_id,
        parent_id=parent_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comments_by_post(db: Session, post_id: int, user_id: int = None):
    # Get all comments for post
    comments = db.query(Comment).options(joinedload(Comment.author)).filter(Comment.post_id == post_id).order_by(Comment.created_at).all()
    
    # We want to return a nested structure, but Pydantic models are flat or recursive.
    # Let's populate reactions first.
    
    # Optimization: Fetch all reactions for these comments in one query? 
    # For simplicity, call get_reaction_counts loop or leave empty for now.
    # Ideally, we enrich the objects.
    
    # Let's just return flat list and let frontend partial nest, 
    # OR build tree here.
    
    # For now, simplistic approach: attach reactions manually
    for c in comments:
        c.reactions = get_reaction_counts(db, "comment", c.id, user_id)
        c.replies = [] # Reset for recursion if needed, though SQLALchemy relations handle this lazily

    # If we want detailed tree, we filter parent_id=None and let SQLAlchemy load replies.
    # But getting reaction counts for nested replies is tricky with lazy loading.
    
    # Let's return the simplified list and let frontend handle threading visually via parent_id,
    # OR creating a recursive response.
    
    # Better: Return all comments, let frontend build tree.
    return comments
