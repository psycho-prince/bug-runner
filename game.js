const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");

let y = 0;
let velocity = 0;
let gravity = 0.6;
let jumpForce = 12;
let grounded = true;

let score = 0;
let speed = 6;
let gameOver = false;

/* INPUT */
document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});
document.addEventListener("touchstart", jump);

function jump() {
  if (!grounded || gameOver) return;
  velocity = jumpForce;
  grounded = false;
}

/* PLAYER LOOP */
function playerLoop() {
  if (gameOver) return;

  velocity -= gravity;
  y += velocity;

  if (y <= 0) {
    y = 0;
    velocity = 0;
    grounded = true;
  }

  player.style.bottom = 40 + y + "px";
  requestAnimationFrame(playerLoop);
}
playerLoop();

/* BUG SPAWN */
function spawnBug() {
  if (gameOver) return;

  const bug = document.createElement("div");
  bug.className = "bug";
  bug.style.left = game.clientWidth + "px";
  game.appendChild(bug);

  let x = game.clientWidth;

  const move = setInterval(() => {
    if (gameOver) {
      clearInterval(move);
      bug.remove();
      return;
    }

    x -= speed;
    bug.style.left = x + "px";

    if (x < -50) {
      clearInterval(move);
      bug.remove();
      score++;
      scoreEl.textContent = `Score: ${score}`;
      if (score % 5 === 0) speed += 0.5;
    }

    if (hit(bug, player)) {
      endGame();
      clearInterval(move);
    }
  }, 16);
}
setInterval(spawnBug, 1600);

/* POWERUP */
function spawnPowerUp() {
  if (gameOver) return;

  const p = document.createElement("div");
  p.className = "powerup";
  p.style.left = game.clientWidth + "px";
  p.style.bottom = "120px";
  game.appendChild(p);

  let x = game.clientWidth;

  const move = setInterval(() => {
    if (gameOver) {
      clearInterval(move);
      p.remove();
      return;
    }

    x -= speed;
    p.style.left = x + "px";

    if (hit(p, player)) {
      speed = Math.max(4, speed - 2);
      p.remove();
      clearInterval(move);
    }

    if (x < -40) {
      p.remove();
      clearInterval(move);
    }
  }, 16);
}
setInterval(spawnPowerUp, 7000);

/* COLLISION */
function hit(a, b) {
  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();
  return !(
    ar.right - 10 < br.left + 10 ||
    ar.left + 10 > br.right - 10 ||
    ar.bottom - 10 < br.top + 10 ||
    ar.top + 10 > br.bottom - 10
  );
}

/* GAME OVER */
function endGame() {
  gameOver = true;
  gameOverScreen.classList.remove("hidden");
}

function restart() {
  location.reload();
}
