const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");

/* FORCE SAFE INITIAL STATE */
gameOverScreen.style.display = "none";

/* GAME STATE */
let gameStarted = false;
let gameOver = false;
let score = 0;
let speed = 6;

/* PHYSICS */
let y = 0;
let velocity = 0;
let gravity = 0.6;
let jumpForce = 14;
let grounded = true;

/* INPUT */
document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});
document.addEventListener("touchstart", jump);

function jump() {
  if (gameOver) return;

  if (!gameStarted) {
    gameStarted = true;
    startSpawns();
  }

  if (!grounded) return;

  velocity = jumpForce;
  grounded = false;
}

/* PLAYER LOOP */
function updatePlayer() {
  if (gameOver) return;

  velocity -= gravity;
  y += velocity;

  if (y <= 0) {
    y = 0;
    velocity = 0;
    grounded = true;
  }

  player.style.bottom = 40 + y + "px";
  requestAnimationFrame(updatePlayer);
}
updatePlayer();

/* ========== SPAWN CONTROLLERS ========== */
let bugTimer = null;
let powerTimer = null;

function startSpawns() {
  bugTimer = setInterval(spawnBug, 1600);
  powerTimer = setInterval(spawnPowerUp, 6000);
}

/* BUG */
function spawnBug() {
  if (gameOver) return;

  const bug = document.createElement("div");
  bug.className = "bug";
  let x = game.clientWidth;
  bug.style.left = x + "px";
  game.appendChild(bug);

  const move = setInterval(() => {
    if (gameOver) {
      cleanup();
      return;
    }

    x -= speed;
    bug.style.left = x + "px";

    if (checkHit(bug, player)) {
      endGame();
      cleanup();
      return;
    }

    if (x < -80) {
      score++;
      scoreEl.textContent = "Score: " + score;
      if (score % 5 === 0) speed += 0.5;
      cleanup();
    }
  }, 16);

  function cleanup() {
    clearInterval(move);
    bug.remove();
  }
}

/* POWER-UP (HEART) */
function spawnPowerUp() {
  if (gameOver) return;

  const p = document.createElement("div");
  p.className = "powerup";
  let x = game.clientWidth;
  p.style.left = x + "px";
  p.style.bottom = "120px";
  game.appendChild(p);

  const move = setInterval(() => {
    if (gameOver) {
      cleanup();
      return;
    }

    x -= speed;
    p.style.left = x + "px";

    if (checkHit(p, player)) {
      speed = Math.max(4, speed - 2); // reward
      cleanup();
      return;
    }

    if (x < -60) {
      cleanup();
    }
  }, 16);

  function cleanup() {
    clearInterval(move);
    p.remove();
  }
}

/* COLLISION — AUTHORITATIVE */
function checkHit(a, b) {
  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();

  return !(
    ar.right - 20 < br.left + 20 ||
    ar.left + 20 > br.right - 20 ||
    ar.bottom - 20 < br.top + 20 ||
    ar.top + 20 > br.bottom - 20
  );
}

/* GAME OVER */
function endGame() {
  gameOver = true;
  clearInterval(bugTimer);
  clearInterval(powerTimer);
  gameOverScreen.style.display = "flex";
}

function restart() {
  location.reload();
}
