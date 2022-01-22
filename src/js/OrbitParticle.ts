import { Particle } from "./Particle";

let lastDrawColor = "";

export class OrbitParticle extends Particle {
  rotation: number = 0;
  radius: number;
  centerParticle: Particle;
  ctx: any;

  targetSize: number;

  constructor(
    x: number,
    y: number,
    size = 5,
    centerParticle: Particle,
    ctx: HTMLCanvasElement
  ) {
    super(x, y, size, "blue");
    this.targetSize = size;
    this.ctx = ctx;

    this.centerParticle = centerParticle;

    const yDistance = centerParticle.y - this.y;
    const xDistance = centerParticle.x - this.x;
    this.radius = Math.sqrt(
      Math.pow(Math.abs(xDistance), 2) + Math.pow(Math.abs(yDistance), 2)
    );

    let lala = this.radius / this.ctx.canvas.width;
    console.log(lala);
  }

  process() {
    this.rotation += 0.005;

    if (this.targetSize != this.size) {
      if (this.targetSize > this.size) {
        this.size += 0.1;
      } else {
        this.size -= 0.1;
      }
    }

    [this.x, this.y] = this.rotate(
      this.centerParticle.x,
      this.centerParticle.y,
      this.x,
      this.y,
      (0.1 + this.radius * 0.0002) * 0.2
    );
  }

  isOffScreen(): boolean {
    return (
      this.x + this.size < 0 ||
      this.y + this.size < 0 ||
      this.y - this.size > this.ctx.canvas.height ||
      this.x - this.size > this.ctx.canvas.width
    );
  }

  draw(): boolean {
    // ctx.globalAlpha = 0.7;
    // ctx.shadowBlur = 15;
    // ctx.shadowColor = this.color;

    // Lets not draw if offscreen
    if (this.isOffScreen()) {
      return false;
    }

    // super.draw();

    // ctx.save();

    // setting ctx.fillStyle is slow, so only do it if needed
    // (only works if Particles are sorted by color, which they are)
    if (lastDrawColor != this.color) {
      lastDrawColor = this.color;

      this.ctx.fillStyle = this.color;
    }

    // ctx.fillRect(this.x, this.y, this.size, this.size);

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    this.ctx.fill();

    return true;
  }

  // from https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
  // Explain: https://www.youtube.com/watch?v=OYuoPTRVzxY
  rotate(cx, cy, x, y, angle) {
    const radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = cos * (x - cx) + sin * (y - cy) + cx,
      ny = cos * (y - cy) - sin * (x - cx) + cy;
    return [nx, ny];
  }

  easeInCubic(x: number): number {
    return x * x * x;
  }
}
