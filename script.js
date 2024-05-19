// Function to get query parameters as an object
function getQueryParams() {
  let query = window.location.search.substring(1);
  let params = query.split("&");
  let result = {};
  params.forEach((param) => {
    let [key, value] = param.split("=");
    result[key] = decodeURIComponent(value);
  });
  return result;
}

function drawTime(minutes, seconds, blink) {
  if (timer == null) {
    throw new Error("Missing timer.");
  }

  timer.innerHTML = "";
  timer.innerHTML += `${minutes.toString().padStart(2, "0")}`;
  timer.innerHTML += `${blink ? " " : ":"}`;
  timer.innerHTML += `${seconds.toString().padStart(2, "0")}`;
}

function playPlantSound() {
  const audio = new Audio("audio/bomb-has-been-planted-sound-effect-cs-go.mp3");
  audio.play();
}

function playExplosionSound() {
  const audio = new Audio("audio/cs-c4-explosion.mp3");
  audio.play();
}

function explode() {
  const framerate = 10;
  let i = 0;

  // Draw first sprite immediately.
  drawSprite(explosionSprites[i]);

  const interval = setInterval(() => {
    i++;
    if (i === explosionSprites.length) {
      clearInterval(interval);
      clearCanvas();
    } else {
      drawSprite(explosionSprites[i]);
    }
  }, (1 / framerate) * 1000);
}

function clearCanvas() {
  if (canvas == null) {
    throw new Error("Missing canvas.");
  }

  // @ts-ignore
  const w = canvas.width;
  // @ts-ignore
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
}

function drawSprite(imgPath) {
  if (canvas == null) {
    throw new Error("Missing canvas.");
  }

  const scale = 2.5;

  // @ts-ignore
  const canvasW = canvas.width;
  // @ts-ignore
  const canvasH = canvas.height;

  const img = new Image();

  img.onload = () => {
    // Image dimensions are only correct inside "onload" callback.
    const targetWidth = img.width * scale;
    const targetHeight = img.height * scale;

    ctx.clearRect(0, 0, canvasW, canvasH);
    const x = (canvasW - targetWidth) / 2;
    const y = (canvasH - targetHeight) / 2;

    ctx.drawImage(img, x, y, targetWidth, targetHeight);
  };

  img.src = imgPath;
}

const timer = document.querySelector("#timer p");

const explosionSprites = [
  "explosion/Explosion_1.png",
  "explosion/Explosion_2.png",
  "explosion/Explosion_2.png",
  "explosion/Explosion_3.png",
  "explosion/Explosion_3.png",
  "explosion/Explosion_3.png",
  "explosion/Explosion_4.png",
  "explosion/Explosion_4.png",
  "explosion/Explosion_4.png",
  "explosion/Explosion_4.png",
  "explosion/Explosion_5.png",
  "explosion/Explosion_5.png",
  "explosion/Explosion_5.png",
  "explosion/Explosion_6.png",
  "explosion/Explosion_6.png",
  "explosion/Explosion_7.png",
  "explosion/Explosion_7.png",
];

// Extract minutes and seconds from query string
let queryParams = getQueryParams();
let minutes = Number(queryParams["minutes"]);
let seconds = Number(queryParams["seconds"]);

playPlantSound();

drawTime(minutes, seconds);

// Blink ":" between minutes & seconds.
let blink = false;

let exploded = false;

setInterval(() => {
  // Explode only after "00:00" was displayed for 1 second.
  if (minutes === 0 && seconds === 0 && !exploded) {
    explode();
    exploded = true;
  }

  if (seconds > 0) {
    seconds -= 1;
  } else if (minutes > 0) {
    minutes -= 1;
    seconds = 59;
  }

  blink = !blink;

  drawTime(minutes, seconds, blink);

  // Sync start of explosion sound with correct time.
  if (minutes === 0 && seconds === 8) {
    playExplosionSound();
  }
}, 1000);

// Canvas stuff to render explosion spritesheet.

const canvas = document.getElementById("canvas");

// @ts-ignore
const ctx = canvas.getContext("2d");
