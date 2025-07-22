// script.js

// Seleciona um time aleatório como resposta secreta
const secretTeam = teams[Math.floor(Math.random() * teams.length)];

// Seleciona elementos do DOM
const input = document.getElementById('team-input');
const guessBtn = document.getElementById('guess-btn');
const resultsTable = document.getElementById('results-table').querySelector('tbody');
const message = document.getElementById('game-message');
const suggestionsList = document.getElementById('suggestions');

// Número máximo de tentativas
const maxAttempts = 6;
let attempts = 0;

// Função para processar o chute
function makeGuess() {
    const guessName = input.value.trim();
    if (!guessName) return;

    // Procura o time chutado na lista
    const guessedTeam = teams.find(team => team.nome.toLowerCase() === guessName.toLowerCase());

    if (!guessedTeam) {
        message.textContent = "Time não encontrado na base de dados.";
        return;
    }

    attempts++;

    // Adiciona linha com feedback visual
    addAttemptRow(guessedTeam, secretTeam);

    if (guessedTeam.nome === secretTeam.nome) {
        message.textContent = `Parabéns! Você acertou! O time era ${secretTeam.nome}.`;
        guessBtn.disabled = true;
        input.disabled = true;
        showConfetti(); // Adiciona animação de confetes
        return;
    }

    if (attempts >= maxAttempts) {
        message.textContent = `Fim de jogo! O time era ${secretTeam.nome}.`;
        guessBtn.disabled = true;
        input.disabled = true;
    } else {
        const restantes = maxAttempts - attempts;
        message.textContent = `${restantes} tentativa${restantes === 1 ? '' : 's'} restante${restantes === 1 ? '' : 's'}.`;
    }

    input.value = '';
}

function getCellClass(field, guessValue, secretValue) {
    if (field === 'fundacao') return '';
    if (guessValue === secretValue) return 'cell-green'; // Troque de 'cell-white' para 'cell-green'
    return 'cell-red';
}

function getFundacaoFeedback(guessYear, secretYear) {
    if (guessYear === secretYear) return `<span style="color:#222;">${guessYear} &#10004;</span>`;
    if (guessYear > secretYear) return `<span style="color:#ffe066;">${guessYear} &uarr;</span>`;
    return `<span style="color:#ffe066;">${guessYear} &darr;</span>`;
}

function getTamanhoFeedback(guessSize, secretSize) {
    if (guessSize === secretSize) return `<span style="color:#222;">${guessSize.toLocaleString()} &#10004;</span>`;
    if (guessSize > secretSize) return `<span style="color:#ffe066;">${guessSize.toLocaleString()} &uarr;</span>`;
    return `<span style="color:#ffe066;">${guessSize.toLocaleString()} &darr;</span>`;
}

function addAttemptRow(guessTeam, secretTeam) {
    const row = document.createElement('tr');
    // Nome
    let td = document.createElement('td');
    td.textContent = guessTeam.nome;
    td.className = getCellClass('nome', guessTeam.nome, secretTeam.nome);
    row.appendChild(td);
    // País
    td = document.createElement('td');
    td.textContent = guessTeam.pais;
    td.className = getCellClass('pais', guessTeam.pais, secretTeam.pais);
    row.appendChild(td);
    // Cidade
    td = document.createElement('td');
    td.textContent = guessTeam.cidade;
    td.className = getCellClass('cidade', guessTeam.cidade, secretTeam.cidade);
    row.appendChild(td);
    // Divisão
    td = document.createElement('td');
    td.textContent = guessTeam.divisao;
    td.className = getCellClass('divisao', guessTeam.divisao, secretTeam.divisao);
    row.appendChild(td);
    // Campeonato
    td = document.createElement('td');
    td.textContent = guessTeam.campeonato;
    td.className = getCellClass('campeonato', guessTeam.campeonato, secretTeam.campeonato);
    row.appendChild(td);
    // Ano de Fundação
    td = document.createElement('td');
    td.innerHTML = getFundacaoFeedback(Number(guessTeam.fundacao), Number(secretTeam.fundacao));
    row.appendChild(td);
    // Tamanho da Torcida
    td = document.createElement('td');
    td.innerHTML = getTamanhoFeedback(Number(guessTeam.tamanho), Number(secretTeam.tamanho));
    row.appendChild(td);

    resultsTable.appendChild(row);
}

function showConfetti() {
    const colors = ['#00ff88', '#ffe066', '#ff4c4c', '#fff', '#8b8b8b', '#00cc6a', '#22cc00', '#9b7c00'];
    const container = document.getElementById('confetti-container');
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 300) + 'px';
        confetti.style.top = (window.innerHeight / 2 - 60) + 'px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1500);
    }
}

// Adiciona evento ao botão
guessBtn.addEventListener('click', makeGuess);

// Permite pressionar Enter para chutar
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        makeGuess();
    }
});

input.addEventListener('input', function () {
    const value = input.value.trim().toLowerCase();
    suggestionsList.innerHTML = '';
    if (!value) return;

    const filtered = teams
        .filter(team => team.nome.toLowerCase().includes(value))
        .slice(0, 5); // Limita a 5 sugestões

    filtered.forEach(team => {
        const li = document.createElement('li');
        li.textContent = team.nome;
        li.style.cursor = 'pointer';
        li.onclick = () => {
            input.value = team.nome;
            suggestionsList.innerHTML = '';
            input.focus();
        };
        suggestionsList.appendChild(li);
    });
});

// Esconde sugestões ao perder o foco
input.addEventListener('blur', () => {
    setTimeout(() => suggestionsList.innerHTML = '', 100);
});
