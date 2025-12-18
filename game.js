const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");

/* GAME STATE */
let started = false;
let dead = false;
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
  if (!grounded || dead) return;
  started = true;
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
  if (dead || !started) return;

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

    if (hit(bug, player)) {
      endGame();
      clearInterval(move);
    }

    if (x < -60) {
      score++;
      scoreEl.textContent = "Score: " + score;
      if (score % 5 === 0) speed += 0.5;
      bug.remove();
      clearInterval(move);
    }
  }, 16);
}, 1600);

/* POWER-UP SPAWN (HEART) */
setInterval(() => {
  if (dead || !started) return;

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
    }

    if (x < -40) {
      p.remove();
      clearInterval(move);
    }
  }, 6000);
}, 6000);

/* COLLISION — BIG SPRITE SAFE */
function hit(a, b) {
  if (!started) return false;

  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();

  return !(
    ar.right - 24 < br.left + 24 ||
    ar.left + 24 > br.right - 24 ||
    ar.bottom - 24 < br.top + 24 ||
    ar.top + 24 > br.bottom - 24
  );
}

/* GAME OVER */
function endGame() {
  dead = true;
  gameOverScreen.classList.remove("hidden");
}

function restart() {
  location.reload();
}
