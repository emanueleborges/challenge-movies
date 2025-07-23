from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import movies, recommend

app = FastAPI(
    title="Movie Recommender API",
    description="Sistema de recomendação de filmes baseado em similaridade de conteúdo",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movies.router)
app.include_router(recommend.router)
