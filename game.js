const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 5
};

let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

function drawPlayer() {
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });
}

function drawEnemies() {
    ctx.fillStyle = 'red';
    enemies.forEach(e => {
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });
}

function updateBullets() {
    bullets = bullets.filter(b => b.y > -b.height);
    bullets.forEach(b => b.y -= b.speed);
}

function updateEnemies() {
    enemies.forEach(e => e.y += e.speed);
    enemies = enemies.filter(e => e.y < canvas.height + e.height);
}

function spawnEnemy() {
    const size = 40;
    const x = Math.random() * (canvas.width - size);
    enemies.push({ x, y: -size, width: size, height: size, speed: 2 });
}

function checkCollisions() {
    enemies.forEach((e, ei) => {
        bullets.forEach((b, bi) => {
            if (b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y) {
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                score += 10;
            }
        });

        if (player.x < e.x + e.width &&
            player.x + player.width > e.x &&
            player.y < e.y + e.height &&
            player.y + player.height > e.y) {
            gameOver = true;
        }
    });
}

function drawScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

function drawMessage() {
    const msg = document.getElementById('message');
    msg.textContent = gameOver ? 'Game Over! Refresh to play again.' : '';
}

function gameLoop() {
    if (gameOver) {
        drawMessage();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBullets();
    drawEnemies();

    updateBullets();
    updateEnemies();
    checkCollisions();
    drawScore();

    requestAnimationFrame(gameLoop);
}

let keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'Space') {
        bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10,
            speed: 7
        });
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function handleInput() {
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y + player.height < canvas.height) {
        player.y += player.speed;
    }
}

setInterval(() => {
    if (!gameOver) {
        spawnEnemy();
    }
}, 1000);

function loop() {
    handleInput();
    gameLoop();
    requestAnimationFrame(loop);
}

loop();
