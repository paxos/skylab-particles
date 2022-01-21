import { ParticleRenderer } from "./ParticleRenderer";

let canvas = document.getElementById("canvas") as any;
let ctx = canvas.getContext("2d");

window.onresize = () => {
  canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
};

// this.canvas.width = 2000;
// this.canvas.height = 600;

canvas.style.width = "100%"; // Note you must post fix the unit type %,px,em
canvas.style.height = "400px";

canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);

new ParticleRenderer(canvas, ctx).setup();
