import pandas as pd
from sqlalchemy import create_engine, text
import os

# Primeiro conectar ao postgres para criar o banco tmdb
POSTGRES_URL = "postgresql+psycopg2://postgres:123456@localhost/postgres"
DATABASE_URL = "postgresql+psycopg2://postgres:123456@localhost/tmdb"

print("Carregando arquivo CSV...")
try:
    df = pd.read_csv("movies.csv")[["id", "title", "overview", "genres", "vote_average"]]
    print(f"Arquivo carregado com {len(df)} registros")
    
    df.rename(columns={"vote_average": "rating"}, inplace=True)
    
    print("Criando banco de dados tmdb se não existir...")
    # Conectar ao postgres default para criar o banco tmdb
    postgres_engine = create_engine(POSTGRES_URL)
    with postgres_engine.connect() as conn:
        # Verificar se o banco existe
        result = conn.execute(text("SELECT 1 FROM pg_database WHERE datname='tmdb'"))
        if not result.fetchone():
            # Criar o banco se não existir
            conn.execute(text("COMMIT"))  # Finalizar transação atual
            conn.execute(text("CREATE DATABASE tmdb"))
            print("Banco de dados 'tmdb' criado com sucesso!")
        else:
            print("Banco de dados 'tmdb' já existe.")
    
    print("Conectando ao banco de dados tmdb...")
    engine = create_engine(DATABASE_URL)
    
    print("Inserindo dados no banco...")
    df.to_sql("movies", engine, if_exists="replace", index=False)
    
    print(f"Importação concluída! {len(df)} filmes importados com sucesso.")
    
    # Verificar se os dados foram inseridos
    result = pd.read_sql("SELECT COUNT(*) as total FROM movies", engine)
    print(f"Total de registros no banco: {result['total'].iloc[0]}")
    
except FileNotFoundError:
    print("Erro: Arquivo 'movies.csv' não encontrado!")
except Exception as e:
    print(f"Erro durante a importação: {e}")
