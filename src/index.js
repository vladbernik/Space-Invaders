import { preload, init, update, draw } from "./game";

export const canvas = document.getElementById("cnvs");
canvas.width = 600;
canvas.height = window.innerHeight;

const tickLength = 15; //ms
let lastTick;
let lastRender;
let stopCycle;

export const bulletSound = document.createElement("audio");
bulletSound.src = new URL("../sounds/shoot.wav", import.meta.url);
document.body.appendChild(bulletSound);

export const mainSound = document.createElement("audio");
mainSound.src = new URL("../sounds/spaceinvaders1.mpeg", import.meta.url);
document.body.appendChild(mainSound);

document.body.addEventListener("click", () => {
  mainSound
    .play()
    .then(() => {
      console.log("Аудио успешно воспроизведено");
    })
    .catch((error) => {
      console.error("Произошла ошибка при воспроизведении аудио:", error);
    });
});
function run(tFrame) {
  stopCycle = window.requestAnimationFrame(run);

  const nextTick = lastTick + tickLength;
  let numTicks = 0;

  if (tFrame > nextTick) {
    const timeSinceTick = tFrame - lastTick;
    numTicks = Math.floor(timeSinceTick / tickLength);
  }

  for (let i = 0; i < numTicks; i++) {
    lastTick = lastTick + tickLength;
    update(lastTick, stopGame);
  }

  draw(canvas, tFrame);
  lastRender = tFrame;
}

export function stopGame() {
  window.cancelAnimationFrame(stopCycle);
}

function onPreloadComplete() {
  lastTick = performance.now();
  lastRender = lastTick;
  stopCycle = null;
  init(canvas);
  run();
}

preload(onPreloadComplete);
