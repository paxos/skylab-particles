const canvas = document.getElementById("canvas") as any;
const ctx = canvas.getContext("2d");

let particles: Particle[] = [];
let centerParticle: Particle;

export function setup() {
  centerParticle = new Particle(canvas.width / 2, canvas.height / 2);
  centerParticle.color = "red";
  centerParticle.size = 20;

  for (let i = 0; i < 1000; i++) {
    particles.push(
      new Particle(
        Math.floor(Math.random() * canvas.width),
        Math.floor(Math.random() * canvas.height)
      )
    );
  }

  window.requestAnimationFrame(draw);
}

export function draw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  centerParticle.draw();

  particles.forEach((p) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    //p.x = p.x + 1;
    // p.color = randomColor;
    p.draw();
  });

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

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}
