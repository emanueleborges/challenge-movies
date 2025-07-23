import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import create_engine
import os

# Conectar ao banco real
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:123456@localhost/tmdb")

print("Carregando dados do banco de dados...")
try:
    engine = create_engine(DATABASE_URL)
    # Carregar apenas os primeiros 10000 filmes para otimizar o desempenho
    df = pd.read_sql("""
        SELECT id, title, overview 
        FROM movies 
        WHERE overview IS NOT NULL AND overview != '' 
        ORDER BY id ASC 
        LIMIT 10000
    """, engine)
    print(f"Carregados {len(df)} filmes do banco de dados")
    
    # Preparar o sistema de recomendação
    vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(df["overview"].fillna(""))
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    print("Sistema de recomendação inicializado com sucesso!")
    
except Exception as e:
    print(f"Erro ao conectar ao banco: {e}")
    # Fallback para dados simulados
    movies_data = [
        {"id": 1, "title": "The Shawshank Redemption", "overview": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."},
        {"id": 2, "title": "The Godfather", "overview": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."},
        {"id": 3, "title": "The Dark Knight", "overview": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests."},
        {"id": 4, "title": "Pulp Fiction", "overview": "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption."},
        {"id": 5, "title": "Forrest Gump", "overview": "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man."},
    ]
    df = pd.DataFrame(movies_data)
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(df["overview"].fillna(""))
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def recommend_movies(movie_id: int, top_n=5):
    # Encontrar o índice do filme no DataFrame pelo ID
    movie_indices = df[df["id"] == movie_id].index
    if len(movie_indices) == 0:
        return {"error": f"Movie with ID {movie_id} not found"}
    
    movie_index = movie_indices[0]
    scores = list(enumerate(cosine_sim[movie_index]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)[1 : top_n + 1]
    
    results = []
    for i, score in scores:
        results.append({
            "id": int(df.iloc[i]["id"]), 
            "title": df.iloc[i]["title"],
            "similarity_score": round(score, 3)
        })
    
    return {
        "movie_id": movie_id,
        "movie_title": df[df["id"] == movie_id]["title"].iloc[0],
        "recommendations": results
    }
