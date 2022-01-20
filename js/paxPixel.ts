const canvas = document.getElementById("canvas") as any;
const ctx = canvas.getContext("2d");

let particles: Particle[] = [];
let centerParticle: Particle;

export function setup() {
  centerParticle = new Particle(canvas.width / 2, canvas.height / 2);
  centerParticle.color = "red";
  centerParticle.size = 20;

  particles.push(new Particle(20, 20));

  // for (let i = 0; i < 1000; i++) {
  //   particles.push(
  //     new Particle(
  //       Math.floor(Math.random() * canvas.width),
  //       Math.floor(Math.random() * canvas.height)
  //     )
  //   );
  // }

  window.requestAnimationFrame(draw);
}

export function draw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  centerParticle.draw(false);

  particles.forEach((p) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    //p.x = p.x + 1;
    // p.color = randomColor;
    p.draw(true);
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
  rotationProgress = 0.1;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(translated: boolean) {
    let x = this.x;
    let y = this.y;

    if (translated) {
      this.rotationProgress += 0.05;
      const xDistance = Math.abs(centerParticle.x - this.x);
      const yDistance = Math.abs(centerParticle.y - this.y);

      //const radius = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2)); // Calc from Tan

      const radius = 60;
      x = radius * Math.cos(this.rotationProgress) + centerParticle.x;
      y = radius * Math.sin(this.rotationProgress) + centerParticle.y;
    }

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}
