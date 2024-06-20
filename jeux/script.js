const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

// Colors
const COLORS = [
    'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

// Tetromino shapes
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 0, 1]], // J
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 0], [0, 1, 1]] // Z
];

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Game variables
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPiece = getRandomPiece();
let gameInterval;

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
                drawBlock(col, row, COLORS[board[row][col] - 1]);
            }
        }
    }
}

function drawPiece(piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(piece.x + x, piece.y + y, piece.color);
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
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }
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
    const shape = piece.shape.map((_, i) => piece.shape.map(row => row[i])).reverse();
    const x = piece.x;
    piece.shape = shape;
    if (collide(board, piece)) {
        piece.shape = shape.map((_, i) => shape.map(row => row[row.length - 1 - i]));
    }
}

function dropPiece() {
    if (!movePiece(currentPiece, 0, 1)) {
        merge(board, currentPiece);
        removeFullLines();
        currentPiece = getRandomPiece();
        if (collide(board, currentPiece)) {
            gameOver();
        }
    }
}

function gameOver() {
    clearInterval(gameInterval);
    alert('Game Over');
}

document.addEventListener('keydown', (e) => {
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
    drawPiece(currentPiece);
});

function gameLoop() {
    drawBoard();
    drawPiece(currentPiece);
    dropPiece();
}

gameInterval = setInterval(gameLoop, 1000);
