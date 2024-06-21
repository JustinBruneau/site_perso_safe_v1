const rows = 6;
const columns = 7;
const gameBoard = document.getElementById('game-board');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart-button');
let currentPlayer = 'red';
let gameActive = true;
let board = [];

// Initialiser le tableau de jeu
for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < columns; c++) {
        board[r][c] = '';
    }
}

// Générer dynamiquement les cellules du tableau de jeu
function createBoard() {
    gameBoard.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', r);
            cell.setAttribute('data-column', c);
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (!gameActive) return;
    
    const clickedCell = event.target;
    const column = parseInt(clickedCell.getAttribute('data-column'));

    // Trouver la première ligne vide dans cette colonne
    for (let r = rows - 1; r >= 0; r--) {
        if (board[r][column] === '') {
            board[r][column] = currentPlayer;
            const cell = document.querySelector(`.cell[data-row='${r}'][data-column='${column}']`);
            cell.classList.add(currentPlayer);
            if (checkWin(r, column)) {
                statusDisplay.textContent = `Le joueur ${currentPlayer === 'red' ? 'rouge' : 'jaune'} a gagné!`;
                gameActive = false;
            } else if (board.flat().every(cell => cell !== '')) {
                statusDisplay.textContent = 'Match nul!';
                gameActive = false;
            } else {
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                statusDisplay.textContent = `C'est au tour du ${currentPlayer === 'red' ? 'rouge' : 'jaune'}`;
            }
            break;
        }
    }
}

function checkWin(row, column) {
    return checkDirection(row, column, 1, 0) || // Vérifier horizontalement
           checkDirection(row, column, 0, 1) || // Vérifier verticalement
           checkDirection(row, column, 1, 1) || // Vérifier en diagonale (/)
           checkDirection(row, column, 1, -1);  // Vérifier en diagonale (\)
}

function checkDirection(row, column, rowIncrement, columnIncrement) {
    let count = 0;
    for (let i = -3; i <= 3; i++) {
        const r = row + i * rowIncrement;
        const c = column + i * columnIncrement;
        if (r >= 0 && r < rows && c >= 0 && c < columns && board[r][c] === currentPlayer) {
            count++;
            if (count === 4) return true;
        } else {
            count = 0;
        }
    }
    return false;
}

function handleRestartGame() {
    board = board.map(row => row.map(cell => ''));
    createBoard();
    currentPlayer = 'red';
    gameActive = true;
    statusDisplay.textContent = `C'est au tour du rouge`;
}

createBoard();
statusDisplay.textContent = `C'est au tour du rouge`;
restartButton.addEventListener('click', handleRestartGame);
