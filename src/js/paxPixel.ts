const canvas = document.getElementById("canvas") as any;
const ctx = canvas.getContext("2d");

let particles: OrbitParticle[] = [];
let centerParticle: Particle;

export function setup() {
  // canvas.width = 1920;
  // canvas.height = 1080;

  window.onresize = () => {
    canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
  };

  // canvas.width = 2000;
  // canvas.height = 600;

  canvas.style.width = "100%"; // Note you must post fix the unit type %,px,em
  canvas.style.height = "400px";

  canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);

  // canvas.width = canvas.height * (canvas.clientWidth / canvas.clientHeight);
  centerParticle = new Particle(canvas.width / 2, canvas.height / 2);
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

  canvas.onmousemove = (event: MouseEvent) => {
    const minDistance = 50;

    const bounds = canvas.getBoundingClientRect();
    const sx = window.scrollX; // This saves a ton of performance
    const sy = window.scrollY;
    particles.forEach((particle) => {
      // Source: https://stackoverflow.com/questions/3680429/click-through-div-to-underlying-elements
      mouse.x = event.pageX - bounds.left - sx;
      mouse.y = event.pageY - bounds.top - sy;

      // first normalize the mouse coordinates from 0 to 1 (0,0) top left
      // off canvas and (1,1) bottom right by dividing by the bounds width and height
      mouse.x /= bounds.width;
      mouse.y /= bounds.height;

      // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution

      mouse.x *= canvas.width;
      mouse.y *= canvas.height;

      const yDistance = mouse.y - particle.y;
      const xDistance = mouse.x - particle.x;
      const distance = Math.sqrt(
        Math.pow(Math.abs(xDistance), 2) + Math.pow(Math.abs(yDistance), 2)
      );

      if (distance <= minDistance) {
        // particle.x += 1;
        // particle.y += 1;
        // particle.color = "red";
        particle.color = "white";
      }
    });
  };

  if (false) {
    particles.push(new OrbitParticle(300, 400, 5, "yellow"));
    particles.push(new OrbitParticle(800, 700, 5, "green"));
  } else {
    for (let i = 0; i < 50000; i++) {
      let p = new OrbitParticle(
        Math.floor(randomIntFromInterval(0, canvas.width)),
        Math.floor(
          randomIntFromInterval(-canvas.height * 4, canvas.height * 4)
        ),
        randomIntFromInterval(8, 12)
      );

      let color = (360 / canvas.width) * p.x;
      p.color = `hsl(${color}, 80%, 50%)`;
      particles.push(p);
    }

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

let lastDrawColor = "";

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

  isOffScreen(): boolean {
    return (
      this.x + this.size < 0 ||
      this.y + this.size < 0 ||
      this.y + this.size > ctx.height ||
      this.x + this.size > ctx.width
    );
  }

  draw() {
    this.process();

    // ctx.globalAlpha = 0.7;
    // ctx.shadowBlur = 15;
    // ctx.shadowColor = this.color;

    // Lets not draw if offscreen
    if (this.isOffScreen()) {
      return;
    }

    // super.draw();

    // ctx.save();

    // setting ctx.fillStyle is slow, so only do it if needed
    // (only works if Particles are sorted by color, which they are)
    if (lastDrawColor != this.color) {
      lastDrawColor = this.color;

      ctx.fillStyle = this.color;
    }

    // ctx.fillRect(this.x, this.y, this.size, this.size);

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
