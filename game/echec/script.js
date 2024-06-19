const colors = ['#FF5722', '#FFC107', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0'];
let cards = [...colors, ...colors]; // array of color pairs

let flippedCards = [];
let matchedCards = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    shuffle(cards);
    const board = document.getElementById('board');

    cards.forEach(color => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="front-face">${color}</div>
            <div class="back-face"></div>
        `;
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !flippedCards.includes(card)) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 1000);
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.querySelector('.front-face').textContent === card2.querySelector('.front-face').textContent) {
        matchedCards.push(card1, card2);
        flippedCards = [];

        if (matchedCards.length === cards.length) {
            setTimeout(() => alert('Congratulations! You won the game!'), 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function resetGame() {
    flippedCards = [];
    matchedCards = [];
    document.getElementById('board').innerHTML = '';
    createBoard();
}

createBoard();
