// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const startGameButton = document.getElementById('startGame');
const addArcherTowerButton = document.getElementById('addArcherTower');
const addIceTowerButton = document.getElementById('addIceTower');
const resourceCount = document.getElementById('resourceCount');
const livesCount = document.getElementById('livesCount');
const waveCount = document.getElementById('waveCount');

let resources = 100;
let lives = 10;
let isPlacingTower = false;
let currentRound = 0;
let placingTowerType = null;
const maxRounds = 10;
let enemySpawnInterval;
let enemiesToSpawn = [];
let gameOver = false;
let gameStarted = false; // Variable to track if the game has started

resourceCount.innerText = resources;
livesCount.innerText = lives;
waveCount.innerText = currentRound;

// Game Variables
let towers = [];
let enemies = [];
let bullets = [];
let wave = 0;

// Define the new path based on the provided image
const path = [
    { x: 0, y: 250 },
    { x: 100, y: 250 },
    { x: 100, y: 150 },
    { x: 200, y: 150 },
    { x: 200, y: 250 },
    { x: 300, y: 250 },
    { x: 300, y: 350 },
    { x: 400, y: 350 },
    { x: 400, y: 250 },
    { x: 500, y: 250 },
    { x: 500, y: 150 },
    { x: 600, y: 150 },
    { x: 600, y: 250 },
    { x: 700, y: 250 },
    { x: 800, y: 250 }
];

// Load door images
const entryDoor = new Image();
entryDoor.src = 'https://twemoji.maxcdn.com/v/latest/72x72/1f6aa.png'; // Entry door emoji
const exitDoor = new Image();
exitDoor.src = 'https://twemoji.maxcdn.com/v/latest/72x72/1f6aa.png'; // Exit door emoji

// Load tower images
const archerTowerImage = new Image();
archerTowerImage.src = 'https://twemoji.maxcdn.com/v/latest/72x72/1f3f9.png'; // Archer tower emoji

const iceTowerImage = new Image();
iceTowerImage.src = 'https://twemoji.maxcdn.com/v/latest/72x72/2744.png'; // Ice tower emoji

// Load arrow image
const arrowImage = new Image();
arrowImage.src = 'https://twemoji.maxcdn.com/v/latest/72x72/1f3f8.png'; // Arrow emoji

// Function to draw the path and doors
function drawPath() {
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();

    // Draw entry and exit doors
    ctx.drawImage(entryDoor, path[0].x - 20, path[0].y - 20, 40, 40);
    ctx.drawImage(exitDoor, path[path.length - 1].x - 20, path[path.length - 1].y - 20, 40, 40);
}

// Enemy types with properties
const enemyTypes = {
    1: { name: 'Gobelin', health: 20, speed: 100, emoji: 'https://twemoji.maxcdn.com/v/latest/72x72/1f47a.png' },
    2: { name: 'Gouloum', health: 10, speed: 150, emoji: 'https://twemoji.maxcdn.com/v/latest/72x72/1f47d.png' },
    3: { name: 'Golem', health: 150, speed: 40, emoji: 'https://twemoji.maxcdn.com/v/latest/72x72/1f479.png' },
    4: { name: 'Boss1', health: 200, speed: 30, emoji: 'https://twemoji.maxcdn.com/v/latest/72x72/1f47f.png' },
    5: { name: 'Boss2', health: 500, speed: 30, emoji: 'https://twemoji.maxcdn.com/v/latest/72x72/1f47b.png' },
    6: { name: 'Boss3', health: 1000, speed: 20, emoji: 'https://twemoji.maxcdn.com/v/latest/72x72/1f479.png' }
};

// Tower Class
class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.range = 150;
        this.damage = 10;
        this.fireRate = 1; // shots per second
        this.lastShot = 0;
    }

    draw() {
        // Draw the tower
        ctx.drawImage(archerTowerImage, this.x, this.y, this.width, this.height);

        // Draw the range circle
        ctx.beginPath();
        ctx.setLineDash([5, 3]); // Set line dash for dotted line
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.range, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)'; // Red color
        ctx.lineWidth = 1; // Less thick
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash to solid line
        ctx.closePath();
    }

    update(deltaTime) {
        this.lastShot += deltaTime;
        if (this.lastShot >= 1 / this.fireRate) {
            this.shoot();
            this.lastShot = 0;
        }
    }

    getWeakestEnemyInRange() {
        let target = null;
        let minHealth = Infinity;

        enemies.forEach(enemy => {
            const distance = Math.hypot(enemy.x - (this.x + this.width / 2), enemy.y - (this.y + this.height / 2));
            if (distance < this.range && enemy.isAlive() && enemy.health < minHealth) {
                target = enemy;
                minHealth = enemy.health;
            }
        });

        return target;
    }

    shoot() {
        const target = this.getWeakestEnemyInRange();
        if (target) {
            bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, target, this.damage));
        }
    }
}

// Ice Tower Class
class IceTower extends Tower {
    constructor(x, y) {
        super(x, y);
        this.damage = 1; // No damage
        this.range = 200; // Increase the range for the Ice Tower
    }

    draw() {
        // Draw the ice tower
        ctx.drawImage(iceTowerImage, this.x, this.y, this.width, this.height);

        // Draw the range circle
        ctx.beginPath();
        ctx.setLineDash([5, 3]); // Set line dash for dotted line
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.range, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.8)'; // Blue color
        ctx.lineWidth = 1; // Less thick
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash to solid line
        ctx.closePath();
    }

    getAnyEnemyInRange() {
        let target = null;

        enemies.forEach(enemy => {
            const distance = Math.hypot(enemy.x - (this.x + this.width / 2), enemy.y - (this.y + this.height / 2));
            if (distance < this.range && enemy.isAlive()) {
                target = enemy;
            }
        });

        return target;
    }

    shoot() {
        const target = this.getAnyEnemyInRange();
        if (target) {
            bullets.push(new IceBullet(this.x + this.width / 2, this.y + this.height / 2, target));
        }
    }
}

// Enemy Class
class Enemy {
    constructor(type) {
        this.x = path[0].x;
        this.y = path[0].y;
        this.width = 30;
        this.height = 30;
        this.speed = enemyTypes[type].speed;
        this.originalSpeed = this.speed; // Save the original speed
        this.health = enemyTypes[type].health;
        this.maxHealth = enemyTypes[type].health;
        this.name = enemyTypes[type].name;
        this.pathIndex = 0;
        this.image = new Image();
        this.image.src = enemyTypes[type].emoji;
        this.isSlowed = false;
        this.slowDuration = 0;
    }

    draw() {
        // Draw the enemy image
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        // Draw the name
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y - this.height / 2 - 15);

        // Draw the health bar
        const healthBarWidth = this.width;
        const healthBarHeight = 5;
        const healthBarX = this.x - this.width / 2;
        const healthBarY = this.y - this.height / 2 - healthBarHeight - 2;
        ctx.fillStyle = 'red';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        ctx.fillStyle = 'green';
        ctx.fillRect(healthBarX, healthBarY, (this.health / this.maxHealth) * healthBarWidth, healthBarHeight);
    }

    update(deltaTime) {
        // Move along the path
        if (this.pathIndex < path.length - 1) {
            const targetX = path[this.pathIndex + 1].x;
            const targetY = path[this.pathIndex + 1].y;
            const angle = Math.atan2(targetY - this.y, targetX - this.x);
            this.x += Math.cos(angle) * this.speed * deltaTime;
            this.y += Math.sin(angle) * this.speed * deltaTime;

            if (Math.hypot(targetX - this.x, targetY - this.y) < 1) {
                this.pathIndex++;
            }
        } else {
            // Reached the end of the path
            lives -= 1;
            livesCount.innerText = lives;
            this.remove();
            if (lives <= 0) {
                gameOver = true;
            }
        }

        // Update slow effect
        if (this.isSlowed) {
            this.slowDuration -= deltaTime;
            if (this.slowDuration <= 0) {
                this.speed = this.originalSpeed;
                this.isSlowed = false;
            }
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            resources += 10;
            resourceCount.innerText = resources;
            this.remove();
        }
    }

    slowEffect(duration) {
        this.speed = this.originalSpeed / 2;
        this.isSlowed = true;
        this.slowDuration = duration;
    }

    remove() {
        const index = enemies.indexOf(this);
        if (index > -1) {
            enemies.splice(index, 1);
        }
    }

    isAlive() {
        return this.health > 0;
    }
}

// Bullet Class
class Bullet {
    constructor(x, y, target, damage) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 300;
    }

    draw() {
        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.drawImage(arrowImage, -10, -5, 20, 10); // Adjust the size and position as needed
        ctx.restore();
    }

    update(deltaTime) {
        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        this.x += Math.cos(angle) * this.speed * deltaTime;
        this.y += Math.sin(angle) * this.speed * deltaTime;

        const distance = Math.hypot(this.target.x - this.x, this.target.y - this.y);
        if (distance < 5) {
            this.target.takeDamage(this.damage);
            bullets.splice(bullets.indexOf(this), 1);
        }
    }
}

// Ice Bullet Class
class IceBullet extends Bullet {
    constructor(x, y, target) {
        super(x, y, target, 0); // No damage
    }

    draw() {
        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update(deltaTime) {
        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        this.x += Math.cos(angle) * this.speed * deltaTime;
        this.y += Math.sin(angle) * this.speed * deltaTime;

        const distance = Math.hypot(this.target.x - this.x, this.target.y - this.y);
        if (distance < 5) {
            this.target.slowEffect(4); // Slow for 4 seconds
            bullets.splice(bullets.indexOf(this), 1);
        }
    }
}

// Waves definition
const waves = {
    1: [{ type: 1, count: 5 }],
    2: [{ type: 1, count: 6 }, { type: 2, count: 2 }],
    3: [{ type: 2, count: 15 }, { type: 3, count: 1 }],
    4: [{ type: 3, count: 3 }, { type: 1, count: 10 }],
    5: [{ type: 4, count: 1 }, { type: 3, count: 5 }],
    6: [{ type: 5, count: 1 }, { type: 3, count: 5 }],
    7: [{ type: 5, count: 5 }, { type: 3, count: 10 }, { type: 2, count: 20 }],
    8: [{ type: 6, count: 1 }],
    9: [{ type: 1, count: 100 }, { type: 2, count: 50 }],
    10: [{ type: 6, count: 5 }]
};

// Start the next round
function startNextRound() {
    if (currentRound < maxRounds) {
        currentRound += 1;
        waveCount.innerText = currentRound;
        enemiesToSpawn = [];
        waves[currentRound].forEach(group => {
            for (let i = 0; i < group.count; i++) {
                enemiesToSpawn.push(group.type);
            }
        });
        enemySpawnInterval = setInterval(spawnEnemy, 500); // Spawn an enemy every 0.5 seconds
    }
}

// Spawn a single enemy
function spawnEnemy() {
    if (enemiesToSpawn.length > 0) {
        const type = enemiesToSpawn.shift();
        enemies.push(new Enemy(type));
    } else {
        clearInterval(enemySpawnInterval);
    }
}

// Check if the new tower is overlapping with any existing towers
function isOverlapping(x, y, width, height) {
    for (let tower of towers) {
        if (
            x < tower.x + tower.width &&
            x + width > tower.x &&
            y < tower.y + tower.height &&
            y + height > tower.y
        ) {
            return true;
        }
    }
    return false;
}

// Check if the new tower is on the path
function isOnPath(x, y, width, height) {
    for (let i = 0; i < path.length - 1; i++) {
        const startX = path[i].x;
        const startY = path[i].y;
        const endX = path[i + 1].x;
        const endY = path[i + 1].y;

        // Check for horizontal or vertical path segments
        if (startX === endX) { // Vertical path segment
            if (x + width > startX - 5 && x < endX + 5 && y < Math.max(startY, endY) && y + height > Math.min(startY, endY)) {
                return true;
            }
        } else if (startY === endY) { // Horizontal path segment
            if (y + height > startY - 5 && y < endY + 5 && x < Math.max(startX, endX) && x + width > Math.min(startX, endX)) {
                return true;
            }
        }
    }
    return false;
}

// Game Loop
let lastTime = 0;

function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the path
    drawPath();

    // Update and draw towers
    towers.forEach(tower => {
        tower.update(deltaTime);
        tower.draw();
    });

    // Update and draw enemies
    enemies.forEach(enemy => {
        enemy.update(deltaTime);
        enemy.draw();
    });

    // Update and draw bullets
    bullets.forEach(bullet => {
        bullet.update(deltaTime);
        bullet.draw();
    });

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PERDU', canvas.width / 2, canvas.height / 2);
    } else if (gameStarted) { // Check if the game has started
        // Check if all enemies are gone and start the next round
        if (enemies.length === 0 && enemiesToSpawn.length === 0 && currentRound < maxRounds) {
            startNextRound();
        }
    }

    requestAnimationFrame(gameLoop);
}

// Start Game button event
startGameButton.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        startNextRound();
    }
});

// Add Archer Tower
addArcherTowerButton.addEventListener('click', () => {
    if (resources >= 50) {
        isPlacingTower = true;
        placingTowerType = 'archer';
    }
});

// Add Ice Tower
addIceTowerButton.addEventListener('click', () => {
    if (resources >= 30) {
        isPlacingTower = true;
        placingTowerType = 'ice';
    }
});

canvas.addEventListener('click', (event) => {
    if (isPlacingTower) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (!isOverlapping(x - 20, y - 20, 40, 40) && !isOnPath(x - 20, y - 20, 40, 40)) {
            if (placingTowerType === 'archer') {
                towers.push(new Tower(x - 20, y - 20));
            } else if (placingTowerType === 'ice') {
                towers.push(new IceTower(x - 20, y - 20));
            }
            resources -= 50;
            resourceCount.innerText = resources;
        } else {
            console.log('Cannot place tower here, it overlaps with another tower or is on the path.');
        }

        isPlacingTower = false;
        placingTowerType = null;
    }
});

// Initialize Game
requestAnimationFrame(gameLoop);
