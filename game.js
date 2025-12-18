const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");

let jumping = false;
let score = 0;
let gameOver = false;

document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

function jump() {
  if (jumping || gameOver) return;
  jumping = true;

  let up = 0;
  const jumpInterval = setInterval(() => {
    if (up >= 120) {
      clearInterval(jumpInterval);
      const downInterval = setInterval(() => {
        if (up <= 0) {
          clearInterval(downInterval);
          jumping = false;
        }
        up -= 5;
        player.style.bottom = 40 + up + "px";
      }, 20);
    }
    up += 5;
    player.style.bottom = 40 + up + "px";
  }, 20);
}

function spawnBug() {
  if (gameOver) return;

  const bug = document.createElement("div");
  bug.classList.add("bug");
  bug.style.left = "100vw";
  game.appendChild(bug);

  let pos = window.innerWidth;
  const moveInterval = setInterval(() => {
    if (pos < -40) {
      clearInterval(moveInterval);
      bug.remove();
      score++;
      scoreEl.innerText = `Score: ${score}`;
    }

    if (checkCollision(bug, player)) {
      endGame();
      clearInterval(moveInterval);
    }

    pos -= 6;
    bug.style.left = pos + "px";
  }, 20);
}

function checkCollision(a, b) {
  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();
  return !(
    ar.top > br.bottom ||
    ar.bottom < br.top ||
    ar.right < br.left ||
    ar.left > br.right
  );
}

function endGame() {
  gameOver = true;
  gameOverScreen.classList.remove("hidden");
}

function restart() {
  location.reload();
}

setInterval(spawnBug, 1800);
