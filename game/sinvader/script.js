document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const width = 20;
    const height = 25;
    const cellCount = width * height;
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const levelDisplay = document.getElementById('level');
    const pauseBtn = document.getElementById('pause-btn');
    const gameOverDisplay = document.getElementById('game-over');

    let currentShooterIndex = 465; // Start position of the shooter
    let direction = 1;
    let invadersId;
    let enemyShootInterval;
    let score = 0;
    let lives = 3;
    let level = 1;
    let pointsPerInvader = 10;
    let invaderSpeed = 1000;
    let isPaused = false;
    let invaderMoveDownInterval;
    let maxRows = 5;
    let maxInvaders = 40;
    let isShooterAbleToShoot = true;
    let shootCooldown = 500;
    let moveInvadersCooldown = 10000;
    let bonusActive = false;

    const invaders = createInvaders(20); // Spawn initial 20 invaders
    const removedInvaders = [];

    // Create cells
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }

    const cells = Array.from(document.querySelectorAll('.grid .cell'));

    // Draw the invaders
    invaders.forEach(invader => cells[invader].classList.add('invader'));

    // Draw the shooter
    cells[currentShooterIndex].classList.add('ship');

    function createInvaders(numInvaders) {
        const invaders = [];
        for (let i = 0; i < numInvaders; i++) {
            let randomPosition;
            do {
                randomPosition = Math.floor(Math.random() * (width * maxRows));
            } while (invaders.includes(randomPosition));
            invaders.push(randomPosition);
        }
        return invaders;
    }

    function moveShooter(e) {
        if (isPaused) return;
        cells[currentShooterIndex].classList.remove('ship');
        switch(e.key) {
            case 'ArrowLeft':
                if (currentShooterIndex % width !== 0) currentShooterIndex -=1;
                break;
            case 'ArrowRight' :
                if (currentShooterIndex % width < width -1) currentShooterIndex +=1;
                break;
        }
        cells[currentShooterIndex].classList.add('ship');
    }

    document.addEventListener('keydown', moveShooter);

    function shoot(e) {
        if (isPaused || !isShooterAbleToShoot) return;
        let laserId;
        let currentLaserIndex = currentShooterIndex;

        function moveLaser() {
            cells[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            if (currentLaserIndex < 0) {
                clearInterval(laserId);
                return;
            }
            cells[currentLaserIndex].classList.add('laser');

            if (cells[currentLaserIndex].classList.contains('invader')) {
                cells[currentLaserIndex].classList.remove('laser');
                cells[currentLaserIndex].classList.remove('invader');
                cells[currentLaserIndex].classList.add('boom');

                setTimeout(() => cells[currentLaserIndex].classList.remove('boom'), 300);
                clearInterval(laserId);

                const alienRemoved = invaders.indexOf(currentLaserIndex);
                removedInvaders.push(alienRemoved);
                score += pointsPerInvader;
                scoreDisplay.textContent = score;

                // Check for bonus every 5-10 invaders killed
                if (removedInvaders.length % 5 === 0) {
                    createBonus();
                }
            }

            if (cells[currentLaserIndex].classList.contains('enemy-laser')) {
                cells[currentLaserIndex].classList.remove('laser');
                cells[currentLaserIndex].classList.remove('enemy-laser');
                clearInterval(laserId);
            }
        }

        if (e.key === 'ArrowUp' || e.key === ' ') {
            isShooterAbleToShoot = false;
            laserId = setInterval(moveLaser, 50);
            setTimeout(() => {
                isShooterAbleToShoot = true;
            }, shootCooldown);
        }
    }

    document.addEventListener('keydown', shoot);

    function enemyShoot() {
        if (isPaused) return;
        let enemyLaserId;
        const allInvaders = Array.from(document.querySelectorAll('.invader'));
        const randomInvaderIndex = Math.floor(Math.random() * allInvaders.length);
        let currentLaserIndex = cells.indexOf(allInvaders[randomInvaderIndex]);

        function moveLaser() {
            cells[currentLaserIndex].classList.remove('enemy-laser');
            currentLaserIndex += width;
            if (currentLaserIndex >= cells.length) {
                clearInterval(enemyLaserId);
                return;
            }
            cells[currentLaserIndex].classList.add('enemy-laser');

            if (cells[currentLaserIndex].classList.contains('ship')) {
                cells[currentLaserIndex].classList.remove('enemy-laser');
                cells[currentLaserIndex].classList.add('boom');

                setTimeout(() => cells[currentLaserIndex].classList.remove('boom'), 300);
                clearInterval(enemyLaserId);
                reduceLives();
            }
        }

        enemyLaserId = setInterval(moveLaser, 50);
    }

    enemyShootInterval = setInterval(enemyShoot, 1500);

    function reduceLives() {
        lives--;
        livesDisplay.textContent = lives;
        if (lives === 0) {
            endGame('GAME OVER');
        }
    }

    function moveInvadersDown() {
        const lastRow = Math.max(...invaders.map(invader => Math.floor(invader / width)));
        if (lastRow < height - 1) {
            for (let i = 0; i <= invaders.length - 1; i++) {
                cells[invaders[i]].classList.remove('invader');
                invaders[i] += width;
            }
            for (let i = 0; i <= invaders.length - 1; i++) {
                if (!removedInvaders.includes(i)) {
                    cells[invaders[i]].classList.add('invader');
                }
            }
        } else {
            endGame('GAME OVER');
        }
    }

    invaderMoveDownInterval = setInterval(moveInvadersDown, moveInvadersCooldown);

    function createBonus() {
        const bonusIndex = Math.floor(Math.random() * width);
        const bonus = cells[bonusIndex];
        bonus.classList.add('bonus');
        setTimeout(() => {
            bonus.classList.remove('bonus');
        }, 5000);
    }

    function nextLevel() {
        level++;
        levelDisplay.textContent = level;
        pointsPerInvader += 5;
        moveInvadersCooldown = Math.max(3000, moveInvadersCooldown - 1000);
        invaders.push(...createInvaders(Math.min(40, invaders.length + 1)));
        invaders.forEach(invader => cells[invader].classList.add('invader'));
        if (level % 10 === 0) {
            lives++;
            livesDisplay.textContent = lives;
        }
    }

    function endGame(message) {
        clearInterval(invadersId);
        clearInterval(enemyShootInterval);
        clearInterval(invaderMoveDownInterval);
        document.querySelector('h1').style.display = 'none';
        document.querySelector('.score').style.display = 'none';
        document.querySelector('.lives').style.display = 'none';
        document.querySelector('.level').style.display = 'none';
        document.querySelector('.grid').style.display = 'none';
        document.querySelector('.controls').style.display = 'none';
        pauseBtn.style.display = 'none';
        gameOverDisplay.innerHTML = `<h2>${message}</h2><p>Score: ${score}</p><p>Manche: ${level}</p><button onclick="window.location.reload()">Rejouer</button>`;
        gameOverDisplay.style.display = 'block';
    }

    pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
        if (!isPaused) {
            invadersId = setInterval(moveInvaders, invaderSpeed);
            enemyShootInterval = setInterval(enemyShoot, 1500);
            invaderMoveDownInterval = setInterval(moveInvadersDown, moveInvadersCooldown);
        } else {
            clearInterval(invadersId);
            clearInterval(enemyShootInterval);
            clearInterval(invaderMoveDownInterval);
        }
    });

    invadersId = setInterval(moveInvaders, invaderSpeed);
});
