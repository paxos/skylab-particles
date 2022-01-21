import { randomIntFromInterval } from "./paxPixel";

export class Particle {
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
