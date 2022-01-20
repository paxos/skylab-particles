const canvas = document.getElementById("canvas") as any;
const ctx = canvas.getContext("2d");

let particles: OrbitParticle[] = [];
let centerParticle: Particle;

export function setup() {
  centerParticle = new Particle(canvas.width / 2, canvas.height / 2);
  centerParticle.color = "red";
  centerParticle.size = 50;

  if (false) {
    particles.push(new OrbitParticle(200, 400));
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
    //  console.log("skip");
    return;
  }
  lastDrawCall = timer;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  particles.forEach((p) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    //p.x = p.x + 1;
    // p.color = randomColor;
    p.draw(true);
  });

  centerParticle.draw(false);

  // ctx.fillStyle = "rgb(200, 0, 0)";
  // ctx.fillRect(10, 10, 50, 50);
  //
  // ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
  // ctx.fillRect(30, 30, 50, 50);

  window.requestAnimationFrame(draw);
}

class Particle {
  x: number;
  y: number;
  size: number = 5;
  color = "blue";
  sin: number;
  cos: number;
  rotation = Math.PI;

  constructor(x: number, y: number, size = randomIntFromInterval(3, 8)) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
  draw(translated: boolean) {
    let x = this.x;
    let y = this.y;

    if (translated) {
      const xDistance = Math.abs(centerParticle.x - this.x);
      const yDistance = Math.abs(centerParticle.y - this.y);

      const radius = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

      this.rotation += 0.01;

      //this.sin += radius * 0.00003;
      //this.cos += radius * 0.00003;

      x = centerParticle.x + radius * Math.sin(this.rotation + this.cos);
      y = centerParticle.y + radius * Math.cos(this.rotation + this.cos);

      // x = radius * this.cos + centerParticle.x;

      //x = radius * this.cos + centerParticle.x;
      //y = radius * this.sin + centerParticle.y;
    }

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class OrbitParticle extends Particle {
  constructor(x: number, y: number, size = randomIntFromInterval(3, 8)) {
    super(x, y, size);
    this.x = x;
    this.y = y;
    this.size = size;

    // TODO: whats the starting rotationProgress?
    const yDistance = Math.abs(centerParticle.y - this.y);
    const xDistance = Math.abs(centerParticle.x - this.x);
    const radius = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

    // TODO: This is incorrect
    // https://www.mathsisfun.com/sine-cosine-tangent.html
    this.sin = yDistance / radius;
    this.cos = xDistance / radius;

    // this.rotationProgress = Math.random() * Math.PI * 2;
  }
}

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
