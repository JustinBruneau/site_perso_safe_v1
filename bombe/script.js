let timeLeft = 15;
let timerId;
let cutSequence = [];

const correctSequence = ['red', 'green', 'yellow'];

function startTimer() {
    timerId = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerId);
            explode();
        } else {
            document.getElementById('timer').innerText = --timeLeft;
        }
    }, 1000);
}

function cutWire(color) {
    cutSequence.push(color);
    if (cutSequence.length === correctSequence.length) {
        if (JSON.stringify(cutSequence) === JSON.stringify(correctSequence)) {
            defuse();
        } else {
            explode();
        }
    }
}

function defuse() {
    clearInterval(timerId);
    document.cookie = "bombDefused=true; path=/";
    window.location.href = "index2.html";
}

function explode() {
    clearInterval(timerId);
    document.body.innerHTML = '';
    document.cookie = "bombDefused=false; path=/";
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function checkBombStatus() {
    const bombDefused = getCookie('bombDefused');
    if (bombDefused !== 'true') {
        window.location.href = "index.html";
    }
}

startTimer();
checkBombStatus();
