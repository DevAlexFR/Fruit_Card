// Variáveis do Prompt
var customPrompt = document.getElementById('customPrompt');
var promptInput = document.getElementById('promptInput');
var promptTitle = document.getElementById('promptTitle');
var errorMessage = document.getElementById('errorMessage');
var isEditing = false;
var currentIndex = null;

// URL Base da API
var API_URL = 'https://crud-fruit.fly.dev';

// Oculta o prompt ao carregar
document.addEventListener('DOMContentLoaded', function () {
    customPrompt.classList.add('hidden');
    customPrompt.style.display = 'none'; // Garante ocultação adicional
});

/**
 * Exibe o prompt para adicionar frutas
 */
function openAddPrompt() {
    isEditing = false;
    currentIndex = null;
    promptTitle.textContent = "Adicionar Nome da Fruta";
    promptInput.value = "";
    hideError();
    customPrompt.classList.remove('hidden');
    customPrompt.style.display = 'flex';
}

/**
 * Exibe o prompt para editar frutas
 */
function openPrompt(index, currentName) {
    isEditing = true;
    currentIndex = index;
    promptTitle.textContent = "Editar Nome da Fruta";
    promptInput.value = currentName;
    hideError();
    customPrompt.classList.remove('hidden');
    customPrompt.style.display = 'flex';
}

/**
 * Fecha o prompt
 */
function closePrompt() {
    customPrompt.classList.add('hidden');
    customPrompt.style.display = 'none';
    promptInput.value = "";
    hideError();
}

/**
 * Exibe mensagens de erro
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('visible');
}

/**
 * Esconde mensagens de erro
 */
function hideError() {
    errorMessage.classList.remove('visible');
}

/**
 * Confirma a ação do prompt
 */
function confirmPrompt() {
    var fruitName = promptInput.value.trim();
    if (fruitName === "") {
        showError("O nome não pode estar vazio!");
        return;
    }
    if (isEditing) {
        updateFruit(currentIndex, fruitName);
    } else {
        addFruit(fruitName);
    }
    closePrompt();
}

/**
 * Carrega as frutas da API e exibe na tela
 */
function loadFruits() {
    fetch(API_URL + '/fruits/')
        .then(response => response.json())
        .then(fruits => {
            var fruitsContainer = document.getElementById('fruitsContainer');
            fruitsContainer.innerHTML = '';
            fruits.forEach((fruit, index) => {
                var fruitCard = document.createElement('div');
                fruitCard.classList.add('card');
                fruitCard.innerHTML = `
                    <h3 class="card-title">${fruit.name}</h3>
                    <div class="card-buttons">
                        <button class="btn btn-primary" onclick="openPrompt(${index}, '${fruit.name}')">Editar</button>
                        <button class="btn btn-danger" onclick="deleteFruit(${index})">Deletar</button>
                    </div>
                `;
                fruitsContainer.appendChild(fruitCard);
            });
        })
        .catch(console.error);
}

/**
 * Adiciona uma nova fruta na API
 */
function addFruit(name) {
    fetch(API_URL + '/fruit/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    })
        .then(loadFruits)
        .catch(console.error);
}

/**
 * Atualiza o nome de uma fruta existente na API
 */
function updateFruit(index, name) {
    fetch(API_URL + '/fruits/' + index, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    })
        .then(loadFruits)
        .catch(console.error);
}

/**
 * Deleta uma fruta da API
 */
function deleteFruit(index) {
    fetch(API_URL + '/fruits/' + index, {
        method: 'DELETE'
    })
        .then(loadFruits)
        .catch(console.error);
}

// Carrega as frutas ao inicializar
loadFruits();

function toggleSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'block' : 'none';
}

function loadFruits() {
    toggleSpinner(true); // Mostra o spinner
    fetch(API_URL + '/fruits/')
        .then(response => response.json())
        .then(fruits => {
            toggleSpinner(false); // Oculta o spinner
            const fruitsContainer = document.getElementById('fruitsContainer');
            fruitsContainer.innerHTML = '';
            fruits.forEach((fruit, index) => {
                const fruitCard = document.createElement('div');
                fruitCard.classList.add('card');
                fruitCard.innerHTML = `
                    <h3 class="card-title">${fruit.name}</h3>
                    <div class="card-buttons">
                        <button class="btn btn-primary" onclick="openPrompt(${index}, '${fruit.name}')">Editar</button>
                        <button class="btn btn-danger" onclick="deleteFruit(${index})">Deletar</button>
                    </div>
                `;
                fruitsContainer.appendChild(fruitCard);
            });
        })
        .catch(error => {
            console.error(error);
            toggleSpinner(false); // Oculta o spinner em caso de erro
        });
}
