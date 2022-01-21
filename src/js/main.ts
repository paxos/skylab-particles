import { ParticleRenderer } from "./ParticleRenderer";

const myWorker = new Worker("js/worker.js");
myWorker.postMessage([1, 2]);
console.log("Message posted to worker");

let canvas = document.getElementById("canvas") as any;

window.onresize = () => {
  canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
};

canvas.style.width = "100%"; // Note you must post fix the unit type %,px,em
canvas.style.height = "400px";
canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);

let offsiteRendering = false;
if (offsiteRendering) {
  // var offscreen = canvas.transferControlToOffscreen();
} else {
  new ParticleRenderer(canvas).setup();
}
