import { ParticleRenderer } from "./ParticleRenderer";

let canvas = document.getElementById("canvas") as any;

window.onresize = () => {};

let maxSize = Math.max(window.innerWidth, window.innerHeight) * 1;

canvas.width = 800 * 1;
canvas.height = 600 * 1;

// canvas.getContext("2d").scale(2, 2);

new ParticleRenderer(canvas).setup();
