const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Constants
const tileSize = 20;
const rows = 20;
const cols = 20;
const width = cols * tileSize;
const height = rows * tileSize;
canvas.width = width;
canvas.height = height;

// Pac-Man
let pacMan = {
    x: 10,
    y: 10,
    dx: 0,
    dy: 0,
    size: tileSize / 2,
    speed: 1
};

// Map
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function drawMap() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.fillStyle = map[row][col] === 1 ? '#0000FF' : '#000';
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }
}

function drawPacMan() {
    ctx.beginPath();
    ctx.arc(pacMan.x * tileSize + tileSize / 2, pacMan.y * tileSize + tileSize / 2, pacMan.size, 0.25 * Math.PI, 1.75 * Math.PI);
    ctx.lineTo(pacMan.x * tileSize + tileSize / 2, pacMan.y * tileSize + tileSize / 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

function movePacMan() {
    pacMan.x += pacMan.dx;
    pacMan.y += pacMan.dy;

    if (map[Math.floor(pacMan.y)][Math.floor(pacMan.x)] === 1) {
        pacMan.x -= pacMan.dx;
        pacMan.y -= pacMan.dy;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        pacMan.dx = 0;
        pacMan.dy = -pacMan.speed;
    } else if (e.key === 'ArrowDown') {
        pacMan.dx = 0;
        pacMan.dy = pacMan.speed;
    } else if (e.key === 'ArrowLeft') {
        pacMan.dx = -pacMan.speed;
        pacMan.dy = 0;
    } else if (e.key === 'ArrowRight') {
        pacMan.dx = pacMan.speed;
        pacMan.dy = 0;
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPacMan();
    movePacMan();
    requestAnimationFrame(gameLoop);
}

gameLoop();
