from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class PostCreate(BaseModel):
    caption: str | None = None
    image_url: str | None = None
    user_id: int