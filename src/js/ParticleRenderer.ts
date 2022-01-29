import { Particle } from "./Particle";
import { OrbitParticle } from "./OrbitParticle";

const FPS = 60;

export class ParticleRenderer {
  canvas: any;
  ctx: any;
  lastDrawCall = 0;
  framerate = (1 / FPS) * 1000;

  particles: OrbitParticle[] = [];
  centerParticle: Particle;
  numberOfParticles = 50000; // default

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  setup() {
    this.centerParticle = new Particle(
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.centerParticle.color = "red";
    this.centerParticle.size = 50;

    this.numberOfParticles = 50000;
    console.log("Decided for number of particles: " + this.numberOfParticles);

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

    this.canvas.onmousemove = (event: MouseEvent) => {
      const minDistance = 50;

      const bounds = this.canvas.getBoundingClientRect();
      const sx = window.scrollX; // This saves a ton of performance
      const sy = window.scrollY;

      for (let particle of this.particles) {
        if (particle.isOffScreen()) {
          continue;
        }
        // Source: https://stackoverflow.com/questions/3680429/click-through-div-to-underlying-elements
        mouse.x = event.pageX - bounds.left - sx;
        mouse.y = event.pageY - bounds.top - sy;

        // first normalize the mouse coordinates from 0 to 1 (0,0) top left
        // off this.canvas and (1,1) bottom right by dividing by the bounds width and height
        mouse.x /= bounds.width;
        mouse.y /= bounds.height;

        // then scale to this.canvas coordinates by multiplying the normalized coords with the this.canvas resolution

        mouse.x *= this.canvas.width;
        mouse.y *= this.canvas.height;

        const yDistance = mouse.y - particle.y;
        const xDistance = mouse.x - particle.x;
        const distance = Math.sqrt(
          Math.pow(Math.abs(xDistance), 2) + Math.pow(Math.abs(yDistance), 2)
        );

        if (distance <= minDistance) {
          particle.size = 4;
        }
      }
    };

    for (let i = 0; i < this.numberOfParticles; i++) {
      let OVERSCALE_FACTOR = 1.5;
      let p = new OrbitParticle(
        Math.floor(
          randomIntFromInterval(
            -this.canvas.width * OVERSCALE_FACTOR,
            this.canvas.width * OVERSCALE_FACTOR
          )
        ),
        Math.floor(
          randomIntFromInterval(
            -this.canvas.height * OVERSCALE_FACTOR,
            this.canvas.height * OVERSCALE_FACTOR
          )
        ),
        randomIntFromInterval(8, 12),
        this.centerParticle,
        this.ctx
      );

      let color = (360 / this.canvas.width) * p.x;
      p.color = `hsl(${color}, 80%, 50%)`;
      this.particles.push(p);
    }

    // Sort particles by color, so we can avoid obsolete color changes when drawing later
    this.particles.sort((a, b) => {
      if (a.color < b.color) {
        return -1;
      }
      if (a.color > b.color) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });

    requestAnimationFrame((t) => this.draw(t));
  }

  draw(timer: DOMHighResTimeStamp): void {
    if (timer - this.lastDrawCall <= this.framerate) {
      requestAnimationFrame((t) => this.draw(t));
      // console.log("skip");
      return;
    }
    this.lastDrawCall = timer;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear this.canvas

    let drawn = 0,
      notDrawn = 0;

    for (let particle of this.particles) {
      particle.process();
      particle.draw() ? ++drawn : ++notDrawn;
    }

    document.getElementById(
      "debug"
    ).innerText = `${drawn} drawn, ${notDrawn} skipped`;

    this.centerParticle.draw();

    requestAnimationFrame((t) => this.draw(t));
  }
}

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
