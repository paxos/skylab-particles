import { ParticleRenderer } from "./ParticleRenderer";

let canvas = document.getElementById("canvas") as any;

window.onresize = () => {};

let maxSize = Math.max(window.innerWidth, window.innerHeight) * 1;

canvas.width = 800;
canvas.height = 600;

new ParticleRenderer(canvas).setup();
