let username = '';
let gameInterval;
let score = 0;
let gameOver = false;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextPieceCanvas = document.getElementById('nextPieceCanvas');
const nextCtx = nextPieceCanvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScoreElement = document.getElementById('finalScore');
const gifContainer = document.getElementById('gifContainer');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;
nextPieceCanvas.width = 4 * BLOCK_SIZE;
nextPieceCanvas.height = 4 * BLOCK_SIZE;

const COLORS = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red', 'brown'];
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
];

function drawBlock(x, y, color, ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function getRandomPiece() {
    const typeId = Math.floor(Math.random() * SHAPES.length);
    const piece = {
        shape: SHAPES[typeId],
        color: COLORS[typeId],
        x: Math.floor((COLS - SHAPES[typeId][0].length) / 2),
        y: 0
    };
    return piece;
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                drawBlock(col, row, COLORS[board[row][col] - 1], ctx);
            }
        }
    }
}

function drawPiece(piece, ctx) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(piece.x + x, piece.y + y, piece.color, ctx);
            }
        });
    });
}

function drawNextPiece(piece) {
    nextCtx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    const offsetX = (nextPieceCanvas.width - piece.shape[0].length * BLOCK_SIZE) / 2;
    const offsetY = (nextPieceCanvas.height - piece.shape.length * BLOCK_SIZE) / 2;
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(x + offsetX / BLOCK_SIZE, y + offsetY / BLOCK_SIZE, piece.color, nextCtx);
            }
        });
    });
}

function collide(board, piece) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x] && 
                (board[y + piece.y] && board[y + piece.y][x + piece.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge(board, piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[y + piece.y][x + piece.x] = COLORS.indexOf(piece.color) + 1;
            }
        });
    });
}

function removeFullLines() {
    let linesCleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            linesCleared++;
        }
    }
    if (linesCleared > 0) {
        updateScore(linesCleared);
    }
}

function updateScore(linesCleared) {
    score += linesCleared * 100;
    scoreElement.textContent = score;
}

function movePiece(piece, offsetX, offsetY) {
    piece.x += offsetX;
    piece.y += offsetY;
    if (collide(board, piece)) {
        piece.x -= offsetX;
        piece.y -= offsetY;
        return false;
    }
    return true;
}

function rotatePiece(piece) {
    const newShape = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse());
    const originalX = piece.x;

    if (!collide(board, { ...piece, shape: newShape })) {
        piece.shape = newShape;
    } else {
        for (let offset = 1; offset <= 2; offset++) {
            piece.x += offset;
            if (!collide(board, { ...piece, shape: newShape })) {
                piece.shape = newShape;
                return;
            }
            piece.x = originalX - offset;
            if (!collide(board, { ...piece, shape: newShape })) {
                piece.shape = newShape;
                return;
            }
            piece.x = originalX;
        }
    }
}

function dropPiece() {
    if (!movePiece(currentPiece, 0, 1)) {
        merge(board, currentPiece);
        removeFullLines();
        currentPiece = nextPiece;
        nextPiece = getRandomPiece();
        if (collide(board, currentPiece)) {
            gameOver = true;
            endGame();
        }
        drawNextPiece(nextPiece);
    }
}

function endGame() {
    clearInterval(gameInterval);
    gameOverMessage.style.display = 'block';
    finalScoreElement.textContent = `Score final: ${score}`;
    saveScore(score);

    let gifSrc = '';
    if (score <= 100) {
        gifSrc = './images/100.gif';
    } else if (score <= 300) {
        gifSrc = './images/300.gif';
    } else if (score <= 500) {
        gifSrc = './images/500.gif';
    } else {
        gifSrc = './images/fin.gif';
    }
    gifContainer.innerHTML = `<img src="${gifSrc}" alt="Score GIF">`;

    restartButton.disabled = false;
}

function startGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    currentPiece = getRandomPiece();
    nextPiece = getRandomPiece();
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
    gameOverMessage.style.display = 'none';
    gifContainer.innerHTML = '';
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    drawBoard();
    drawPiece(currentPiece, ctx);
    drawNextPiece(nextPiece);
    gameInterval = setInterval(gameLoop, 1000);
}

function gameLoop() {
    if (!gameOver) {
        drawBoard();
        drawPiece(currentPiece, ctx);
        dropPiece();
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameOver) {
        switch (e.key) {
            case 'ArrowLeft':
                movePiece(currentPiece, -1, 0);
                break;
            case 'ArrowRight':
                movePiece(currentPiece, 1, 0);
                break;
            case 'ArrowDown':
                dropPiece();
                break;
            case 'ArrowUp':
                rotatePiece(currentPiece);
                break;
        }
        drawBoard();
        drawPiece(currentPiece, ctx);
    }
});

restartButton.addEventListener('click', () => {
    startGame();
});

function saveScore(score) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_score.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            fetchTopScores();
        }
    };
    xhr.send(`username=${username}&score=${score}`);
}

function fetchTopScores() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'get_top_scores.php', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const topScores = JSON.parse(xhr.responseText);
            const topScoresList = document.getElementById('topScoresList');
            topScoresList.innerHTML = '';
            topScores.forEach(score => {
                const li = document.createElement('li');
                li.textContent = `${score.username}: ${score.score}`;
                topScoresList.appendChild(li);
            });
        }
    };
    xhr.send();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('usernamePrompt').style.display = 'block';
    document.getElementById('gameContainer').style.display = 'none';
    document.querySelector('#usernamePrompt form').addEventListener('submit', (e) => {
        e.preventDefault();
        username = document.getElementById('username').value;
        if (username) {
            document.getElementById('usernamePrompt').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'flex';
            startGame();
        } else {
            alert('Veuillez entrer un pseudo');
        }
    });
    fetchTopScores();
});
