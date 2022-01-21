import { ParticleRenderer } from "./ParticleRenderer";

let canvas = document.getElementById("canvas") as any;

window.onresize = () => {
  canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
};

canvas.style.width = "100%"; // Note you must post fix the unit type %,px,em
canvas.style.height = "400px";
canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);

let offsiteRendering = true;
if (offsiteRendering) {
  const offscreen = canvas.transferControlToOffscreen();
  const myWorker = new Worker(new URL("./worker.js", import.meta.url), {
    name: "my-worker",
    type: "module",
  });
  // const myWorker = new Worker("js/worker.js");
  myWorker.postMessage({ canvas: offscreen }, [offscreen]);
  console.log("Message posted to worker");
} else {
  new ParticleRenderer(canvas).setup();
}
