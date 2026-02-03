from sqlalchemy.orm import Session
from app.models.post import Post
from app.schemas.post import PostCreate

def create_post(db: Session, post: PostCreate, author_id: int = None):
    db_post = Post(
        title=post.title,
        content=post.content,
        department=post.department,
        tags=post.tags,
        type=post.type,
        author_id=author_id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

from sqlalchemy.orm import joinedload

def get_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Post).options(joinedload(Post.author)).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

def get_post(db: Session, post_id: int):
    return db.query(Post).filter(Post.id == post_id).first()

def delete_post(db: Session, post_id: int):
    # This will assume cascade delete is set up in DB or handled manually if not.
    # For now, simplistic delete.
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if db_post:
        db.delete(db_post)
        db.commit()
    return db_post
