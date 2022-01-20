const canvas = document.getElementById("canvas") as any;
const ctx = canvas.getContext("2d");

let particles: OrbitParticle[] = [];
let centerParticle: Particle;

export function setup() {
  centerParticle = new Particle(canvas.width / 2, canvas.height / 2);
  centerParticle.color = "red";
  centerParticle.size = 50;

  if (false) {
    particles.push(new OrbitParticle(300, 400, 5, "yellow"));
    particles.push(new OrbitParticle(800, 700, 5, "green"));
  } else {
    for (let i = 0; i < 5000; i++) {
      let p = new OrbitParticle(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height)
      );

      let color = (360 / canvas.width) * p.x;
      p.color = `hsl(${color}, 80%, 50%)`;
      particles.push(p);
    }
  }

  window.requestAnimationFrame(draw);
}

let lastDrawCall = 0;
let framerate = (1 / 120) * 1000;

export function draw(timer: DOMHighResTimeStamp): void {
  if (timer - lastDrawCall < framerate) {
    window.requestAnimationFrame(draw);
    return;
  }
  lastDrawCall = timer;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  particles.forEach((p) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    p.draw();
  });

  centerParticle.draw();

  window.requestAnimationFrame(draw);
}

class Particle {
  x: number;
  y: number;
  size: number = 5;
  color = "blue";

  constructor(
    x: number,
    y: number,
    size = randomIntFromInterval(3, 8),
    color = "blue"
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class OrbitParticle extends Particle {
  sin: number;
  cos: number;
  rotation: number = 0;
  yDistance: number;
  xDistance: number;
  radius: number;

  constructor(
    x: number,
    y: number,
    size = randomIntFromInterval(3, 8),
    color = "blue"
  ) {
    super(x, y, size, color);

    // TODO: whats the starting rotationProgress?
    this.yDistance = centerParticle.y - this.y;
    this.xDistance = centerParticle.x - this.x;
    this.radius = Math.sqrt(
      Math.pow(Math.abs(this.xDistance), 2) +
        Math.pow(Math.abs(this.yDistance), 2)
    );

    // https://www.mathsisfun.com/sine-cosine-tangent.html
    // https://setosa.io/ev/sine-and-cosine/
    this.sin = this.yDistance / this.radius;
    this.cos = this.xDistance / this.radius;

    // this.rotationProgress = Math.random() * Math.PI * 2;
  }

  process() {
    this.rotation += 0.005;

    // let xRadian = Math.acos(this.cos) + this.rotation; // Clamp to max radians, which is 2*Math.PI
    // let yRadian = Math.asin(this.sin) + this.rotation;
    //
    // let cos = Math.cos(xRadian);
    // let sin = Math.sin(yRadian);

    // Re-Calculate position based on orbit point
    // this.x = centerParticle.x - this.xDistance;

    [this.x, this.y] = rotate(
      centerParticle.x,
      centerParticle.y,
      this.x,
      this.y,
      0.1 + this.radius * 0.0001
    );
  }

  draw() {
    this.process();
    super.draw();
  }
}

// from https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
function rotate(cx, cy, x, y, angle) {
  const radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (x - cx) + sin * (y - cy) + cx,
    ny = cos * (y - cy) - sin * (x - cx) + cy;
  return [nx, ny];
}

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function degrees_to_radians(degrees) {
  return degrees * (Math.PI / 180);
}

export function radians_to_degrees(radians) {
  return radians * (180 / Math.PI);
}
