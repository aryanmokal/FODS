from fastapi import FastAPI

from database import engine, Base
import models

from routes.auth import router as auth_router
from routes.posts import router as posts_router


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(title="InstaDS API")


# Register API routes
app.include_router(auth_router)
app.include_router(posts_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to the InstaDS API!"
    }
