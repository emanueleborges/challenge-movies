from pydantic import BaseModel

class MovieSchema(BaseModel):
    id: int
    title: str
    overview: str
    genres: str
    rating: float

    class Config:
        from_attributes = True
