from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ..schemas import MovieSchema
from ..crud import get_movie, get_all_movies
from ..database import SessionLocal

router = APIRouter()

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.get("/movies/{movie_id}", response_model=MovieSchema)
async def read_movie(movie_id: int, db: AsyncSession = Depends(get_db)):
    movie = await get_movie(db, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@router.get("/movies", response_model=List[MovieSchema])
async def read_movies(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    movies = await get_all_movies(db, skip, limit)
    return movies
