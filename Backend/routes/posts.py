from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Post
from schemas import PostCreate


router = APIRouter(prefix="/posts", tags=["Posts"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_post(post: PostCreate, db: Session = Depends(get_db)):

    new_post = Post(
        caption=post.caption,
        image_url=post.image_url,
        user_id=post.user_id
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return {
        "message": "Post created successfully",
        "post_id": new_post.id
    }