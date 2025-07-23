from fastapi import APIRouter
from ..services.recommender import recommend_movies

router = APIRouter()

@router.get("/recommend/{movie_id}")
async def get_recommendations(movie_id: int):
    return recommend_movies(movie_id)
