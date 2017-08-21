"use strict"

// Find the canvas via the DOM and get a 2D context to it
let canvas = document.getElementById("canvasSystem");
let ctx = canvas.getContext("2d");

// function drawOrbit(radius) {
//   ctx.strokeStyle = "#373737";
//   ctx.beginPath();
//   ctx.arc(320, 320, radius, 0, Math.PI*2, true);
//   ctx.closePath();
//   ctx.stroke();
// }

// Classes -- SolarSystem class is a container class for StellarObject objects
//  -- Star, Planet and Moon inherit from superclass StellarObject

class SolarSystem {
  // this.star = new Star();
  // let planets = [];

  constructor(star, planets){

  }
}

class StellarObject {
  constructor(x, y, r){
    this.x = x;
    this.y = y;
    this.r = r;
  }
}

class Star extends StellarObject {
  constructor(){
    super();
  }
  draw(){
    let g = ctx.createRadialGradient(320,320,4,320,320,32);
    g.addColorStop(0, "#FFFF99");
    g.addColorStop(0.05, "#FFFF99")
    g.addColorStop(1, "#000000");

    ctx.fillStyle = g;
    // ctx.beginPath();
    // ctx.arc(320, 320, 24, 0, Math.PI*2, true);
    // ctx.closePath();
    ctx.fillRect(0,0,640,640);
  }

  update(){

  }
}

class Planet extends StellarObject {
  constructor(){
    super();

    this.theta = Math.random() * 2 * Math.PI;
    this.dtheta = Math.random() / 25;
    this.radius = Math.floor(Math.random() * 240) + 32;

    this.x = (Math.cos(this.theta) * this.radius) + 320;
    this.y = (Math.sin(this.theta) * this.radius) + 320;

    this.trailLength = 64;
    this.trailPositions = [];
  }

  draw(){
    this.update();
    //this.drawOrbit(this.radius);
    this.drawTrail();

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

  drawOrbit(r) {
    ctx.strokeStyle = "#3F3F3F";
    ctx.beginPath();
    ctx.arc(320, 320, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();
  }

  drawTrail(){
    let opacity = 0;

    for (let trail of this.trailPositions){

      ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
      ctx.beginPath();
      ctx.arc(trail.x, trail.y, 1, this.theta, this.theta - 0.1, true);
      ctx.stroke();

      opacity += 0.5/this.trailLength;
    }
  }

  update(){
    if (this.theta >= (2 * Math.PI)) this.theta = 0;

    this.trailPositions.push({x: this.x, y: this.y});
    if (this.trailPositions.length > this.trailLength) this.trailPositions.shift();

    this.x = (Math.cos(this.theta) * this.radius) + 320;
    this.y = (Math.sin(this.theta) * this.radius) + 320;

    this.theta += this.dtheta;
  }
}

class Moon extends StellarObject {
  constructor(){
    super();
  }

}

// Test Star & Planet
let star = new Star();
let p1 = new Planet();
let p2 = new Planet();

// Animation of the Canvas element
function animateCanvas(){
  window.requestAnimationFrame(animateCanvas);

  ctx.fillStyle = "black";
  ctx.fillRect(0,0,640,640);

  star.draw();
  p1.draw();
  p2.draw();
}

// Start the canvas animation; recursively calls window.requestAnimationFrame()
animateCanvas();
