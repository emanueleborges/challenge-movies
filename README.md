# Movie Recommender System

Sistema de recomendação de filmes usando FastAPI, PostgreSQL e algoritmos de Machine Learning baseados em similaridade de conteúdo.

## 🎬 Funcionalidades

- **API RESTful** com FastAPI
- **Sistema de recomendação** baseado em TF-IDF e similaridade de cossenos
- **Interface web responsiva** com Bootstrap
- **Banco de dados** PostgreSQL para armazenamento de filmes
- **Importação de dados** a partir de arquivos CSV
- **Documentação automática** da API com Swagger UI

## 🚀 Tecnologias Utilizadas

### Backend
- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para Python
- **PostgreSQL** - Banco de dados relacional
- **Pandas** - Manipulação de dados
- **Scikit-learn** - Algoritmos de Machine Learning
- **TF-IDF Vectorizer** - Análise de texto
- **Uvicorn** - Servidor ASGI

### Frontend
- **HTML5** - Estrutura
- **Bootstrap 5** - Framework CSS responsivo
- **JavaScript ES6+** - Interatividade
- **Bootstrap Icons** - Ícones
- **Google Fonts** - Tipografia

## 📋 Pré-requisitos

- Python 3.8+
- PostgreSQL 12+
- pip (gerenciador de pacotes Python)

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd desafio
```

### 2. Configure o ambiente Python
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # No Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure o banco de dados
```bash
# Criar banco PostgreSQL
createdb tmdb

# Configurar variável de ambiente (opcional)
export DATABASE_URL="postgresql+psycopg2://postgres:senha@localhost/tmdb"
```

### 4. Importe os dados
```bash

https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies
baixar o arquivo no link acima: TMDB_movie_dataset_v11.csv(567.66 MB)
renomear TMDB_movie_dataset_v11.csv Para movies.csv
copiar movies.csv para dentro da pasta: scripts

cd scripts
python import_dataset.py
```

### 5. Execute o backend
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Abra o frontend
Abra o arquivo `frontend/index.html` em seu navegador ou use um servidor web local.

## 📱 Como Usar

### API Endpoints

#### Filmes
- `GET /movies` - Lista filmes (com paginação)
- `GET /movies/{movie_id}` - Busca filme por ID

#### Recomendações
- `GET /recommend/{movie_id}` - Obter recomendações para um filme

### Interface Web

1. **Buscar Filme**: Digite um ID para encontrar um filme específico
2. **Obter Recomendações**: Digite um ID para ver filmes similares
3. **Listar Filmes**: Navegue pela lista de filmes disponíveis
4. **Detalhes**: Clique em um filme para ver informações completas

## 🏗️ Estrutura do Projeto

```
desafio/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # Aplicação principal FastAPI
│   │   ├── database.py          # Configuração do banco
│   │   ├── models.py            # Modelos SQLAlchemy
│   │   ├── schemas.py           # Schemas Pydantic
│   │   ├── crud.py              # Operações de banco
│   │   ├── routers/
│   │   │   ├── movies.py        # Rotas de filmes
│   │   │   └── recommend.py     # Rotas de recomendação
│   │   └── services/
│   │       └── recommender.py   # Lógica de recomendação
│   ├── requirements.txt         # Dependências Python
│   └── .gitignore
├── frontend/
│   ├── index.html              # Interface principal
│   ├── script.js               # Lógica JavaScript
│   └── styles.css              # Estilos customizados
├── scripts/
│   └── import_dataset.py       # Script de importação
└── README.md
```

## 🧠 Algoritmo de Recomendação

O sistema utiliza:

1. **TF-IDF (Term Frequency-Inverse Document Frequency)** para vetorizar as sinopses dos filmes
2. **Similaridade de Cossenos** para calcular a similaridade entre filmes
3. **Otimização** carregando apenas os 10.000 filmes mais bem avaliados

### Como Funciona

1. As sinopses dos filmes são processadas e convertidas em vetores TF-IDF
2. É calculada a matriz de similaridade de cossenos entre todos os filmes
3. Para um filme específico, são retornados os 5 filmes mais similares
4. Os resultados incluem o score de similaridade

## 📊 API Documentation

Acesse a documentação interativa em:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Configuração

### Variáveis de Ambiente

```bash
DATABASE_URL=postgresql+psycopg2://user:password@localhost/tmdb
```

### Dependências Backend

```txt
fastapi
uvicorn
sqlalchemy
asyncpg
psycopg2-binary
pydantic
pandas
scikit-learn
python-dotenv
```

## 🎯 Exemplo de Uso da API

```python
import requests

# Buscar filme
response = requests.get("http://localhost:8000/movies/100")
movie = response.json()

# Obter recomendações
response = requests.get("http://localhost:8000/recommend/100")
recommendations = response.json()
```

## 🚦 Status do Projeto

- ✅ API Backend funcional
- ✅ Sistema de recomendação implementado
- ✅ Interface web responsiva
- ✅ Importação de dados CSV
- ✅ Documentação da API
- ✅ CORS configurado
- ✅ Paginação implementada

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando FastAPI e Bootstrap.

---

**Powered by FastAPI & Bootstrap** 🚀
