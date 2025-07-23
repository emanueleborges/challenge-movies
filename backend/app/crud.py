from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from .models import Movie

async def get_movie(db: AsyncSession, movie_id: int):
    result = await db.execute(select(Movie).where(Movie.id == movie_id))
    return result.scalar_one_or_none()

async def get_all_movies(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Movie).offset(skip).limit(limit))
    return result.scalars().all()
