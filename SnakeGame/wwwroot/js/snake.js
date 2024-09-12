const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 16; // Box size
const canvasSize = 32; // Number of boxes in one row/column
const speed = 150; // Interval time for snake movement

let snake;
let food;
let d;
let score;
let game;

// Initialize the game
function init() {
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    food = { x: Math.floor(Math.random() * canvasSize) * box, y: Math.floor(Math.random() * (canvasSize - 1)) * box };
    d = '';
    score = 0;

    if (game) {
        clearInterval(game);
    }

    // Hide score and game over message initially
    document.getElementById('scoreText').style.display = 'none';
    document.getElementById('gameOverText').style.display = 'none';

    game = setInterval(draw, speed);
}

// Handle direction change
function direction(event) {
    if (event.keyCode === 37 && d !== 'RIGHT') d = 'LEFT';
    else if (event.keyCode === 38 && d !== 'DOWN') d = 'UP';
    else if (event.keyCode === 39 && d !== 'LEFT') d = 'RIGHT';
    else if (event.keyCode === 40 && d !== 'UP') d = 'DOWN';
}

// Draw a rounded rectangle
function drawRoundedRect(x, y, size, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + size - radius, y);
    ctx.arc(x + size - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI);
    ctx.lineTo(x + size, y + size - radius);
    ctx.arc(x + size - radius, y + size - radius, radius, 0, 0.5 * Math.PI);
    ctx.lineTo(x + radius, y + size);
    ctx.arc(x + radius, y + size - radius, radius, 0.5 * Math.PI, Math.PI);
    ctx.lineTo(x, y + radius);
    ctx.arc(x + radius, y + radius, radius, Math.PI, 1.5 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

// Draw the game
function draw() {
    ctx.fillStyle = 'white'; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'black';
        drawRoundedRect(snake[i].x, snake[i].y, box, 4); // Draw each snake segment with rounded corners
    }

    ctx.fillStyle = 'red';
    drawRoundedRect(food.x, food.y, box, 4); // Draw food with rounded corners

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * canvasSize) * box, y: Math.floor(Math.random() * (canvasSize - 1)) * box };
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (
        snakeX < 0 || snakeX >= canvas.width ||
        snakeY < 0 || snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        document.getElementById('gameOverText').style.display = 'block';
        document.getElementById('scoreText').style.display = 'block';
        document.getElementById('scoreText').innerText = 'Total Score: ' + score;
        return;
    }

    snake.unshift(newHead);
}

// Check for collisions
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

// Restart the game
function restartGame() {
    document.getElementById('scoreText').style.display = 'none'; // Hide score before restarting
    document.getElementById('gameOverText').style.display = 'none'; // Hide game over text
    init();
}

// Initialize the game on load
init();

document.addEventListener('keydown', direction);
document.getElementById('restartButton').addEventListener('click', restartGame);
