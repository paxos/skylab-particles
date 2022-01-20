const canvas = document.getElementById("canvas") as any;
const ctx = canvas.getContext("2d");

let particles: OrbitParticle[] = [];
let centerParticle: Particle;

export function setup() {
  // canvas.width = 1920;
  // canvas.height = 1080;

  window.onresize = () => {
    // canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
  };
  canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
  centerParticle = new Particle(canvas.width / 2, canvas.height / 2);
  centerParticle.color = "red";
  centerParticle.size = 50;

  if (false) {
    particles.push(new OrbitParticle(300, 400, 5, "yellow"));
    particles.push(new OrbitParticle(800, 700, 5, "green"));
  } else {
    for (let i = 0; i < 10000; i++) {
      let p = new OrbitParticle(
        Math.floor(randomIntFromInterval(0, canvas.width)),
        Math.floor(
          randomIntFromInterval(-canvas.height * 4, canvas.height * 4)
        ),
        randomIntFromInterval(15, 25)
      );

      let color = (360 / canvas.width) * p.x;
      p.color = `hsl(${color}, 80%, 50%)`;
      particles.push(p);
    }
  }

  window.requestAnimationFrame(draw);
}

let lastDrawCall = 0;
let framerate = (1 / 60) * 1000;

export function draw(timer: DOMHighResTimeStamp): void {
  if (timer - lastDrawCall <= framerate) {
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

  draw() {}
}

class OrbitParticle extends Particle {
  rotation: number = 0;
  radius: number;

  constructor(x: number, y: number, size = 5, color = "blue") {
    super(x, y, size, color);

    const yDistance = centerParticle.y - this.y;
    const xDistance = centerParticle.x - this.x;
    this.radius = Math.sqrt(
      Math.pow(Math.abs(xDistance), 2) + Math.pow(Math.abs(yDistance), 2)
    );
  }

  process() {
    this.rotation += 0.005;

    [this.x, this.y] = rotate(
      centerParticle.x,
      centerParticle.y,
      this.x,
      this.y,
      (0.1 + this.radius * 0.0002) * 0.2
    );
  }

  draw() {
    this.process();
    // super.draw();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// from https://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
// Explain: https://www.youtube.com/watch?v=OYuoPTRVzxY
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
