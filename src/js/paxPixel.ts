import { OrbitParticle } from "./OrbitParticle";
import { Particle } from "./Particle";
import * as PIXI from "pixi.js";
import * as Color from "color";

let particles: OrbitParticle[] = [];
let centerParticle: Particle;

const PARTICLE_COUNT = 60000;
const MIN_PARTICLE_SIZE = 3;
const MAX_PARTICLE_SIZE = 5;

const app = new PIXI.Application({
  width: document.documentElement.clientWidth,
  height: 600,
  antialias: true,
  // forceCanvas: true,
});

//const graphics = new PIXI.Graphics(); // we render into this

export function setup() {
  const container = document.getElementById("canvas-container") as any;
  container.appendChild(app.view);

  // app.ticker.maxFPS = 60;
  // app.ticker.minFPS = 60;
  app.ticker.add((delta) => {
    draw(delta);
  });

  centerParticle = new Particle(app.view.width / 2, app.view.height / 2);
  centerParticle.color = "red";
  centerParticle.size = 50;

  const mouse = {
    x: 0,
    y: 0, // coordinates
    lastX: 0,
    lastY: 0, // last frames mouse position
    b1: false,
    b2: false,
    b3: false, // buttons
    buttonNames: ["b1", "b2", "b3"], // named buttons
  };

  // canvas.onmousemove = (event: MouseEvent) => {
  //   const minDistance = 50;
  //
  //   const bounds = canvas.getBoundingClientRect();
  //   const sx = window.scrollX; // This saves a ton of performance
  //   const sy = window.scrollY;
  //
  //   for (let particle of particles) {
  //     if (particle.isOffScreen()) {
  //       continue;
  //     }
  //     // Source: https://stackoverflow.com/questions/3680429/click-through-div-to-underlying-elements
  //     mouse.x = event.pageX - bounds.left - sx;
  //     mouse.y = event.pageY - bounds.top - sy;
  //
  //     // first normalize the mouse coordinates from 0 to 1 (0,0) top left
  //     // off canvas and (1,1) bottom right by dividing by the bounds width and height
  //     mouse.x /= bounds.width;
  //     mouse.y /= bounds.height;
  //
  //     // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution
  //
  //     mouse.x *= canvas.width;
  //     mouse.y *= canvas.height;
  //
  //     const yDistance = mouse.y - particle.y;
  //     const xDistance = mouse.x - particle.x;
  //     const distance = Math.sqrt(
  //       Math.pow(Math.abs(xDistance), 2) + Math.pow(Math.abs(yDistance), 2)
  //     );
  //
  //     if (distance <= minDistance) {
  //       // particle.x += 1;
  //       // particle.y += 1;
  //       // particle.color = "red";
  //       // particle.color = "white";
  //       particle.size = 4;
  //     }
  //   }
  // };

  let pContainer = new PIXI.ParticleContainer(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    let p = new OrbitParticle(
      Math.floor(randomIntFromInterval(0, app.view.width)),
      Math.floor(
        randomIntFromInterval(-app.view.height * 4, app.view.height * 4)
      ),
      randomIntFromInterval(MIN_PARTICLE_SIZE, MAX_PARTICLE_SIZE),
      centerParticle,
      app
    );

    let color = (360 / app.view.width) * p.x;
    p.color = `hsl(${color}, 80%, 50%)`;
    p.prepareDraw();

    pContainer.addChild(p.sprite);
    particles.push(p);
  }

  app.stage.addChild(pContainer);

  // Sort particles by color, so we can avoid obsolete color changes when drawing later
  particles.sort((a, b) => {
    if (a.color < b.color) {
      return -1;
    }
    if (a.color > b.color) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });

  // window.requestAnimationFrame(draw);
}

let lastDrawCall = 0;
let framerate = (1 / 60) * 1000;

export function draw(timer: number): void {
  // if (timer - lastDrawCall <= framerate) {
  //   window.requestAnimationFrame(draw);
  //   return;
  // }
  // lastDrawCall = timer;
  //
  // ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
  //
  // graphics.clear();
  for (let particle of particles) {
    particle.process();
    //particle.draw();
  }
  //
  // centerParticle.draw();
  //
}

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
