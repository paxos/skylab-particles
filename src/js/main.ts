import { ParticleRenderer } from "./ParticleRenderer";

let canvas = document.getElementById("canvas") as any;

window.onresize = () => {
  canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
};

canvas.style.width = "100%"; // Note you must post fix the unit type %,px,em
canvas.style.height = "400px";
canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);

new ParticleRenderer(canvas).setup();
