let invertColors = false;
class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.prevPos = this.pos.copy();
  }
  update() {
    this.prevPos = this.pos.copy();
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }
  applyForce(force) {
    this.acc.add(force);
  }
  interact() {
    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(this.pos, mouse);
    let dist = dir.mag();
    dir.normalize();
    if (mouseIsPressed) {
      dir.mult(-1);
    }
    if (dist < 100) {
      this.applyForce(dir);
    }
  }
  repel(other) {
    let dir = p5.Vector.sub(this.pos, other.pos);
    let dist = dir.mag();
    if (dist < 50) {
      dir.normalize();
      dir.div(dist);
      this.applyForce(dir);
      other.applyForce(dir.mult(-1));
    }
  }
  edges() {
    if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x *= -1;
    } else if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -1;
    }
    if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y *= -1;
    } else if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y *= -1;
    }
  }
  display() {
    stroke(200, 100, 100);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    fill(invertColors ? 20 : 220);
    ellipse(this.pos.x + 2, this.pos.y + 2, 12);
    fill(invertColors ? 40 : 200);
    ellipse(this.pos.x, this.pos.y, 10);
  }
}
let particles = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  ellipseMode(CENTER);
  for (let i = 0; i < 100; i++) {
    particles[i] = new Particle();
  }
}
function draw() {
  background(invertColors ? 0 : 240, 10);
  drawingContext.shadowOffsetX = 2;
  drawingContext.shadowOffsetY = 2;
  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = color(0, 0, invertColors ? 40 : 10);
  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  let qtree = new QuadTree(boundary, 100);
  for (let p of particles) {
    qtree.insert(p);
  }
  for (let p of particles) {
    let range = new Rectangle(p.pos.x, p.pos.y, 50, 50);
    let others = qtree.query(range);
    for (let other of others) {
      if (p !== other) {
        p.repel(other);
      }
    }
    p.interact();
    p.update();
    p.edges();
    p.display();
  }
}
function mouseClicked() {
  invertColors = !invertColors;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
