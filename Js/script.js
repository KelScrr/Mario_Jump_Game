let gameActive = false;
let loop;

const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const scoreValueElement = document.getElementById('score-value');
const highScoresElement = document.getElementById('high-scores');
const gameOverElement = document.getElementById('game-over');
const startScreen = document.getElementById('start-screen');
const playerNameInput = document.getElementById('player-name');

let score = 0;
let highScores = [];

document.addEventListener('DOMContentLoaded', () => {
    highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    updateHighScores(true);
});

const updateHighScores = (displayOnStart = false, playerName = 'Anônimo') => {
    highScores.push({ name: playerName, score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);
    localStorage.setItem('highScores', JSON.stringify(highScores));

    if (displayOnStart) {
        const highScoresStartElement = document.getElementById('high-scores-start');
        highScoresStartElement.innerHTML = '';
        for (let i = 0; i < highScores.length; i++) {
            highScoresStartElement.innerHTML += `${i + 1}. ${highScores[i].name}: ${highScores[i].score}<br>`;
        }
    } else {
        highScoresElement.innerHTML = '';
        for (let i = 0; i < highScores.length; i++) {
            highScoresElement.innerHTML += `${i + 1}. ${highScores[i].name}: ${highScores[i].score}<br>`;
        }
    }
};
const jump = () => {
    if (!isGameOver) {
        mario.classList.add('jump');
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
};

const gameLoop = () => {
    if (!isGameOver) {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        if (pipePosition <= 170 && marioPosition < 85 && pipePosition > 0) {
            pipe.style.animation = 'none';
            pipe.style.left = `${pipePosition}px`;

            mario.style.animation = 'none';
            mario.style.bottom = `${marioPosition}px`;

            mario.src = './images/game-over.png';
            mario.style.width = '140px';
            mario.style.marginLeft = '50px';

            clouds.style.display = 'none';

            isGameOver = true;
            gameOver();
        }
    }

    updateScore();
};


const gameOver = () => {
    clearInterval(loop);
    gameOverElement.classList.remove('hidden');

    scoreElement.style.display = 'none';
    finalScoreElement.style.display = 'block';

    updateHighScores();

    scoreValueElement.innerText = score;

    document.getElementById('high-scores-container').classList.remove('hidden');
};

const stopGame = () => {
    gameActive = false;
    clearInterval(loop);
};

const restartGame = () => {
    stopGame();
    isGameOver = false;
    score = 0;

    scoreElement.style.display = 'block';
    finalScoreElement.style.display = 'none';

    scoreElement.innerText = 'Score: 0';
    mario.src = 'images/mario.gif';
    mario.style.width = '240px';
    mario.style.marginLeft = '0';
    pipe.style.animation = 'pipe-animation 1.5s infinite linear';
    mario.style.animation = '';
    mario.style.bottom = '0';
    pipe.style.left = 'initial';

    clouds.style.display = 'block';

    gameOverElement.classList.add('hidden');
    loop = setInterval(gameLoop, 10);
};

const startGame = () => {
    if (!gameActive) {
        const playerName = playerNameInput.value || 'Anônimo';
        gameActive = true;
        startScreen.style.display = 'none';
        document.querySelector('.game-board').style.display = 'block';
        loop = setInterval(gameLoop, 10);
        updateHighScores(true, playerName);
    }
};

document.getElementById('start-button').addEventListener('click', startGame);

document.addEventListener('DOMContentLoaded', () => {
    updateHighScores(true);
});

document.addEventListener('keydown', jump);
