const chessBoard = document.getElementById('chess-board');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart-button');
const whiteCapturedList = document.getElementById('white-captured-list');
const blackCapturedList = document.getElementById('black-captured-list');

let board = [];
let selectedCell = null;
let currentPlayer = 'white';
let whiteCapturedPieces = [];
let blackCapturedPieces = [];

const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

// Initialisation du tableau de jeu
function initializeBoard() {
    const initialBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    board = initialBoard.map(row => row.slice());
    renderBoard();
}

function renderBoard() {
    chessBoard.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            cell.textContent = pieces[board[row][col]] || '';
            cell.addEventListener('click', handleCellClick);
            chessBoard.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));
    if (selectedCell) {
        const fromRow = parseInt(selectedCell.getAttribute('data-row'));
        const fromCol = parseInt(selectedCell.getAttribute('data-col'));
        if (isValidMove(fromRow, fromCol, row, col)) {
            movePiece(fromRow, fromCol, row, col);
            switchPlayer();
        }
        selectedCell.classList.remove('selected');
        selectedCell = null;
    } else {
        if (board[row][col] && isPlayerPiece(board[row][col], currentPlayer)) {
            selectedCell = cell;
            selectedCell.classList.add('selected');
        }
    }
}

function isPlayerPiece(piece, player) {
    return (player === 'white' && piece === piece.toUpperCase()) || (player === 'black' && piece === piece.toLowerCase());
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol].toLowerCase();
    const playerPiece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];
    const isWhitePiece = playerPiece === playerPiece.toUpperCase();
    const direction = isWhitePiece ? -1 : 1;

    if (targetPiece && isPlayerPiece(targetPiece, currentPlayer)) {
        return false;
    }

    switch (piece) {
        case 'p':
            if (fromCol === toCol && board[toRow][toCol] === '') {
                if (toRow === fromRow + direction) return true;
                if ((isWhitePiece && fromRow === 6 || !isWhitePiece && fromRow === 1) && toRow === fromRow + 2 * direction && board[fromRow + direction][fromCol] === '') return true;
            }
            if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && board[toRow][toCol] !== '' && !isPlayerPiece(board[toRow][toCol], currentPlayer)) return true;
            break;
        case 'r':
            if (fromRow === toRow || fromCol === toCol) return !isPathBlocked(fromRow, fromCol, toRow, toCol);
            break;
        case 'n':
            if (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1 || Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2) return true;
            break;
        case 'b':
            if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) return !isPathBlocked(fromRow, fromCol, toRow, toCol);
            break;
        case 'q':
            if (fromRow === toRow || fromCol === toCol || Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) return !isPathBlocked(fromRow, fromCol, toRow, toCol);
            break;
        case 'k':
            if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) return true;
            break;
    }
    return false;
}

function isPathBlocked(fromRow, fromCol, toRow, toCol) {
    const rowIncrement = Math.sign(toRow - fromRow);
    const colIncrement = Math.sign(toCol - fromCol);
    let r = fromRow + rowIncrement;
    let c = fromCol + colIncrement;
    while (r !== toRow || c !== toCol) {
        if (board[r][c] !== '') return true;
        r += rowIncrement;
        c += colIncrement;
    }
    return false;
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = board[toRow][toCol];
    if (piece !== '') {
        capturePiece(piece);
    }
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = '';
    renderBoard();
}

function capturePiece(piece) {
    const capturedPiece = pieces[piece.toLowerCase()];
    if (currentPlayer === 'white') {
        whiteCapturedPieces.push(capturedPiece);
        updateCapturedList('white');
    } else {
        blackCapturedPieces.push(capturedPiece);
        updateCapturedList('black');
    }
}

function updateCapturedList(player) {
    const capturedList = player === 'white' ? whiteCapturedList : blackCapturedList;
    capturedList.innerHTML = ''; // Clear previous list

    const capturedPieces = player === 'white' ? whiteCapturedPieces : blackCapturedPieces;

    capturedPieces.forEach(piece => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>${piece}</span>`;
        capturedList.appendChild(listItem);
    });

    // Add strike-through style to captured pieces
    capturedPieces.forEach((piece, index) => {
        if (index < capturedPieces.length - 1) {
            capturedList.children[index].classList.add('strikethrough');
        }
    });
}

function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));
    if (selectedCell) {
        const fromRow = parseInt(selectedCell.getAttribute('data-row'));
        const fromCol = parseInt(selectedCell.getAttribute('data-col'));
        if (isValidMove(fromRow, fromCol, row, col)) {
            movePiece(fromRow, fromCol, row, col);
            switchPlayer();
        }
        selectedCell.classList.remove('selected');
        selectedCell = null;
    } else {
        if (board[row][col] && isPlayerPiece(board[row][col], currentPlayer)) {
            selectedCell = cell;
            selectedCell.classList.add('selected');
        }
    }
}

function isPlayerPiece(piece, player) {
    return (player === 'white' && piece === piece.toUpperCase()) || (player === 'black' && piece === piece.toLowerCase());
}

// Rest of the functions remain unchanged
