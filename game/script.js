const startButton = document.getElementById('start-button');
const gameArea = document.getElementById('game-area');
const target = document.getElementById('target');
const scoreSpan = document.getElementById('score');
let score = 0;
let gameActive = false;

startButton.addEventListener('click', startGame);
target.addEventListener('click', hitTarget);

function startGame() {
    score = 0;
    gameActive = true;
    scoreSpan.textContent = score;
    startButton.style.display = 'none';
    target.style.display = 'block';
    moveTarget();
}

function endGame() {
    gameActive = false;
    startButton.style.display = 'block';
    target.style.display = 'none';
    alert('Jeu terminé! Votre score est: ' + score);
}

function moveTarget() {
    if (!gameActive) return;

    const x = Math.random() * (gameArea.clientWidth - target.offsetWidth);
    const y = Math.random() * (gameArea.clientHeight - target.offsetHeight);

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;

    setTimeout(moveTarget, 1000);
}

function hitTarget() {
    if (!gameActive) return;
    score++;
    scoreSpan.textContent = score;
    moveTarget();
}
