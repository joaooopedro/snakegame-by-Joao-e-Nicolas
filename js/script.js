const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu");
const instrucao = document.querySelector(".instrucao");
const buttonPlay = document.querySelector(".btn-play");
const dificuldadeButtons = document.querySelectorAll(".dificuldade-btn");

const audio = new Audio("assets/audio.mp3");

const size = 30;
const initialPosition = { x: 270, y: 240 };
let snake = [initialPosition];
let direction, loopId;
let gameSpeed = 300;


const comidaImage = new Image();
comidaImage.src = "assets/comida.png";

const incrementScore = () => {
    score.innerText = +score.innerText + 10;
};

const randomNumber = (min, max) => Math.round(Math.random() * (max - min) + min);
const randomPosition = () => Math.round(randomNumber(0, canvas.width - size) / 30) * 30;

const food = {
    x: randomPosition(),
    y: randomPosition()
};


const drawFood = () => {
    ctx.drawImage(comidaImage, food.x, food.y, size, size);
};

const drawSnake = () => {
    ctx.fillStyle = "#ddd";
    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            ctx.fillStyle = "white";
        }
        ctx.fillRect(position.x, position.y, size, size);
    });
};

const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];
    let newHead;

    if (direction === "right") newHead = { x: head.x + size, y: head.y };
    if (direction === "left") newHead = { x: head.x - size, y: head.y };
    if (direction === "down") newHead = { x: head.x, y: head.y + size };
    if (direction === "up") newHead = { x: head.x, y: head.y - size };

    snake.push(newHead);
    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";
    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        incrementScore();
        snake.push({ ...head }); 
        audio.play();

        
        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x === x && position.y === y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
    }
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;
    const selfCollision = snake.find((position, index) => index < neckIndex && position.x === head.x && position.y === head.y);

    if (wallCollision || selfCollision) {
        gameOver();
    }
};

const gameOver = () => {
    direction = undefined;
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";
};

const gameLoop = () => {
    clearInterval(loopId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood(); 
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision(); 
    loopId = setTimeout(gameLoop, gameSpeed);
};

document.addEventListener("keydown", ({ key }) => {
    if (key === "ArrowRight" && direction !== "left") direction = "right";
    if (key === "ArrowLeft" && direction !== "right") direction = "left";
    if (key === "ArrowDown" && direction !== "up") direction = "down";
    if (key === "ArrowUp" && direction !== "down") direction = "up";
});

buttonPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    instrucao.style.display = "flex";
    canvas.style.filter = "none";
    snake = [initialPosition];
    direction = undefined;
    food.x = randomPosition();
    food.y = randomPosition();
});

dificuldadeButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        instrucao.style.display = "none";
        const dificuldade = event.target.dataset.dificuldade;

        if (dificuldade === "facil") {
            gameSpeed = 300;
        } else if (dificuldade === "medio") {
            gameSpeed = 150;
        } else if (dificuldade === "dificil") {
            gameSpeed = 50;
        }

        direction = undefined;
        gameLoop();
    });
});
