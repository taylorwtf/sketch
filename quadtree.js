class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.particles = [];
    this.divided = false;
  }
  insert(particle) {
    if (!this.boundary.contains(particle)) {
      return false;
    }
    if (this.particles.length < this.capacity) {
      this.particles.push(particle);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      if (this.northeast.insert(particle)) {
        return true;
      } else if (this.northwest.insert(particle)) {
        return true;
      } else if (this.southeast.insert(particle)) {
        return true;
      } else if (this.southwest.insert(particle)) {
        return true;
      }
    }
  }
  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;
    let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    this.northeast = new QuadTree(ne, this.capacity);
    let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    this.northwest = new QuadTree(nw, this.capacity);
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.southeast = new QuadTree(se, this.capacity);
    let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    this.southwest = new QuadTree(sw, this.capacity);
    this.divided = true;
  }
  query(range, found) {
    if (!found) {
      found = [];
    }
    if (!this.boundary.intersects(range)) {
      return found;
    } else {
      for (let p of this.particles) {
        if (range.contains(p)) {
          found.push(p);
        }
      }
      if (this.divided) {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
      }
    }
    return found;
  }
}
class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  contains(particle) {
    let x = particle.pos.x;
    let y = particle.pos.y;
    return (x >= this.x - this.w &&
            x < this.x + this.w &&
            y >= this.y - this.h &&
            y < this.y + this.h);
  }
  intersects(range) {
    return !(range.x - range.w > this.x + this.w ||
             range.x + range.w < this.x - this.w ||
             range.y - range.h > this.y + this.h ||
             range.y + range.h < this.y - this.h);
  }
}
