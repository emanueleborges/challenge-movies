// Base URL da API
const API_BASE_URL = 'http://localhost:8000';

// Elementos do DOM
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsSection = document.getElementById('resultsSection');
const recommendationsSection = document.getElementById('recommendationsSection');

// Função para mostrar/esconder loading
function showLoading() {
    loadingSpinner.style.display = 'block';
    resultsSection.innerHTML = '';
    recommendationsSection.innerHTML = '';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Função para mostrar mensagem de erro
function showError(message) {
    hideLoading();
    resultsSection.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Erro:</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        </div>
    `;
}

// Função para mostrar mensagem de sucesso
function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    resultsSection.insertBefore(alertDiv, resultsSection.firstChild);
}

// Função para formatar gêneros
function formatGenres(genres) {
    if (!genres) return '';
    return genres.split(',').map(genre => 
        `<span class="genre-tag">${genre.trim()}</span>`
    ).join('');
}

// Função para criar card de filme
function createMovieCard(movie, showSimilarity = false) {
    const similarityBadge = showSimilarity ? 
        `<span class="similarity-score">${(movie.similarity_score * 100).toFixed(1)}% similar</span>` : 
        `<span class="rating-badge">${movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>`;
    
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card movie-card h-100" onclick="getMovieDetails(${movie.id})">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h5 class="card-title fw-bold text-primary">${movie.title}</h5>
                        ${similarityBadge}
                    </div>
                    <p class="movie-overview">${movie.overview ? movie.overview.substring(0, 150) + '...' : 'Sem descrição disponível'}</p>
                    <div class="mb-3">
                        ${movie.genres ? formatGenres(movie.genres) : ''}
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">ID: ${movie.id}</small>
                        <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); getRecommendationsForMovie(${movie.id})">
                            <i class="bi bi-magic"></i> Recomendar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para buscar filme por ID
async function searchMovie() {
    const movieId = document.getElementById('movieIdInput').value;
    if (!movieId) {
        showError('Por favor, digite um ID de filme válido.');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);
        
        if (!response.ok) {
            throw new Error(`Filme não encontrado (ID: ${movieId})`);
        }

        const movie = await response.json();
        hideLoading();
        
        resultsSection.innerHTML = `
            <div class="col-12 mb-4">
                <h3 class="text-white">
                    <i class="bi bi-film me-2"></i>Filme Encontrado
                </h3>
            </div>
            ${createMovieCard(movie)}
        `;
        
        showSuccess(`Filme "${movie.title}" carregado com sucesso!`);
        
    } catch (error) {
        showError(error.message);
    }
}

// Função para obter detalhes do filme
async function getMovieDetails(movieId) {
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar detalhes do filme (ID: ${movieId})`);
        }

        const movie = await response.json();
        hideLoading();
        
        // Mostrar modal com detalhes
        showMovieModal(movie);
        
    } catch (error) {
        showError(error.message);
    }
}

// Função para mostrar modal com detalhes do filme
function showMovieModal(movie) {
    const modalHtml = `
        <div class="modal fade" id="movieModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title fw-bold">${movie.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-8">
                                <h6 class="fw-bold text-primary mb-2">Sinopse</h6>
                                <p class="mb-3">${movie.overview || 'Sem descrição disponível'}</p>
                                
                                <h6 class="fw-bold text-primary mb-2">Gêneros</h6>
                                <div class="mb-3">
                                    ${movie.genres ? formatGenres(movie.genres) : 'Não informado'}
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card bg-light">
                                    <div class="card-body text-center">
                                        <h6 class="fw-bold">Avaliação</h6>
                                        <div class="rating-badge mb-3">${movie.rating ? movie.rating.toFixed(1) : 'N/A'}</div>
                                        <h6 class="fw-bold">ID</h6>
                                        <p class="text-muted">${movie.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary" onclick="getRecommendationsForMovie(${movie.id}); bootstrap.Modal.getInstance(document.getElementById('movieModal')).hide();">
                            <i class="bi bi-magic me-2"></i>Ver Recomendações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente se houver
    const existingModal = document.getElementById('movieModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Adicionar novo modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    modal.show();
}

// Função para obter recomendações
async function getRecommendations() {
    const movieId = document.getElementById('recommendInput').value;
    if (!movieId) {
        showError('Por favor, digite um ID de filme para obter recomendações.');
        return;
    }

    await getRecommendationsForMovie(movieId);
}

// Função para obter recomendações para um filme específico
async function getRecommendationsForMovie(movieId) {
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/recommend/${movieId}`);
        
        if (!response.ok) {
            throw new Error(`Erro ao obter recomendações para o filme ID: ${movieId}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        hideLoading();
        
        // Mostrar filme base
        resultsSection.innerHTML = `
            <div class="col-12 mb-4">
                <h3 class="text-white">
                    <i class="bi bi-film me-2"></i>Filme Base
                </h3>
            </div>
            <div class="col-12 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title fw-bold text-primary">${data.movie_title}</h5>
                        <p class="text-muted">ID: ${data.movie_id}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Mostrar recomendações
        recommendationsSection.innerHTML = `
            <div class="col-12 mb-4">
                <h3 class="text-white">
                    <i class="bi bi-stars me-2"></i>Filmes Recomendados
                </h3>
                <p class="text-light">Baseado na similaridade de conteúdo</p>
            </div>
            <div class="row">
                ${data.recommendations.map(movie => createMovieCard(movie, true)).join('')}
            </div>
        `;
        
        showSuccess(`${data.recommendations.length} recomendações encontradas para "${data.movie_title}"!`);
        
    } catch (error) {
        showError(error.message);
    }
}

// Função para carregar lista de filmes
async function loadMovies(page = 0, limit = 15) {
    showLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/movies?skip=${page * limit}&limit=${limit}`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar lista de filmes');
        }

        const movies = await response.json();
        hideLoading();
        
        if (movies.length === 0) {
            showError('Nenhum filme encontrado.');
            return;
        }
        
        resultsSection.innerHTML = `
            <div class="col-12 mb-4">
                <div class="d-flex justify-content-between align-items-center">
                    <h3 class="text-white">
                        <i class="bi bi-collection me-2"></i>Lista de Filmes
                    </h3>
                    <div class="btn-group">
                        <button class="btn btn-outline-light" onclick="loadMovies(${Math.max(0, page - 1)}, ${limit})" ${page === 0 ? 'disabled' : ''}>
                            <i class="bi bi-chevron-left"></i> Anterior
                        </button>
                        <button class="btn btn-outline-light" onclick="loadMovies(${page + 1}, ${limit})" ${movies.length < limit ? 'disabled' : ''}>
                            Próximo <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
            ${movies.map(movie => createMovieCard(movie)).join('')}
        `;
        
        showSuccess(`${movies.length} filmes carregados!`);
        
    } catch (error) {
        showError(error.message);
    }
}

// Função para limpar resultados
function clearResults() {
    resultsSection.innerHTML = '';
    recommendationsSection.innerHTML = '';
    document.getElementById('movieIdInput').value = '';
    document.getElementById('recommendInput').value = '';
}

// Event listeners para Enter nos inputs
document.getElementById('movieIdInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchMovie();
    }
});

document.getElementById('recommendInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getRecommendations();
    }
});

// Carregar alguns filmes ao inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    loadMovies();
});
