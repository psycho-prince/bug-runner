const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");

/* ===== HARD RESET (CRITICAL) ===== */
gameOverScreen.style.display = "none";   // force-hide overlay
gameOverScreen.classList.add("hidden");  // backup

/* GAME STATE */
let started = false;
let dead = false;
let spawnEnabled = false;

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
  if (dead) return;

  if (!started) {
    started = true;

    // delay spawns so player is safe on start
    setTimeout(() => {
      spawnEnabled = true;
    }, 600);
  }

  if (!grounded) return;

  velocity = jumpForce;
  grounded = false;
}

/* PLAYER LOOP */
function updatePlayer() {
  if (dead) return;

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

/* BUG SPAWN */
setInterval(() => {
  if (dead || !spawnEnabled) return;

  const bug = document.createElement("div");
  bug.className = "bug";
  let x = game.clientWidth;
  bug.style.left = x + "px";
  game.appendChild(bug);

  const move = setInterval(() => {
    if (dead) {
      bug.remove();
      clearInterval(move);
      return;
    }

    x -= speed;
    bug.style.left = x + "px";

    if (x < -80) {
      score++;
      scoreEl.textContent = "Score: " + score;
      if (score % 5 === 0) speed += 0.5;
      bug.remove();
      clearInterval(move);
      return;
    }

    if (hit(bug, player)) {
      endGame();
      clearInterval(move);
    }
  }, 16);
}, 1600);

/* POWER-UP (HEART) */
setInterval(() => {
  if (dead || !spawnEnabled) return;

  const p = document.createElement("div");
  p.className = "powerup";
  let x = game.clientWidth;
  p.style.left = x + "px";
  p.style.bottom = "120px";
  game.appendChild(p);

  const move = setInterval(() => {
    if (dead) {
      p.remove();
      clearInterval(move);
      return;
    }

    x -= speed;
    p.style.left = x + "px";

    if (hit(p, player)) {
      speed = Math.max(4, speed - 2);
      p.remove();
      clearInterval(move);
      return;
    }

    if (x < -60) {
      p.remove();
      clearInterval(move);
    }
  }, 16);
}, 6000);

/* COLLISION — DISABLED UNTIL SAFE */
function hit(a, b) {
  if (!spawnEnabled) return false;

  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();

  return !(
    ar.right - 30 < br.left + 30 ||
    ar.left + 30 > br.right - 30 ||
    ar.bottom - 30 < br.top + 30 ||
    ar.top + 30 > br.bottom - 30
  );
}

/* GAME OVER */
function endGame() {
  dead = true;
  gameOverScreen.style.display = "flex";
  gameOverScreen.classList.remove("hidden");
}

function restart() {
  location.reload();
}
