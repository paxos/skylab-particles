import { Particle } from "./Particle";
import { OrbitParticle } from "./OrbitParticle";

export class ParticleRenderer {
  ctx: any;
  canvas: any;
  lastDrawCall = 0;
  framerate = (1 / 60) * 1000;

  particles: OrbitParticle[] = [];
  centerParticle: Particle;

  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.canvas = canvas;
  }

  setup() {
    // this.canvas.width = this.canvas.height * (canvas.clientWidth / this.canvas.clientHeight);
    this.centerParticle = new Particle(
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.centerParticle.color = "red";
    this.centerParticle.size = 50;

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
          // particle.x += 1;
          // particle.y += 1;
          // particle.color = "red";
          // particle.color = "white";
          particle.size = 4;
        }
      }
    };

    for (let i = 0; i < 50000; i++) {
      let p = new OrbitParticle(
        Math.floor(randomIntFromInterval(0, this.canvas.width)),
        Math.floor(
          randomIntFromInterval(-this.canvas.height * 4, this.canvas.height * 4)
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

    window.requestAnimationFrame((t) => this.draw(t));
  }

  draw(timer: DOMHighResTimeStamp): void {
    if (timer - this.lastDrawCall <= this.framerate) {
      window.requestAnimationFrame((t) => this.draw(t));
      return;
    }
    this.lastDrawCall = timer;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear this.canvas

    for (let particle of this.particles) {
      particle.draw();
    }

    this.centerParticle.draw();

    window.requestAnimationFrame((t) => this.draw(t));
  }
}

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
