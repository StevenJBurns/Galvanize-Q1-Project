"use strict"

// Find the canvas via the DOM and get a 2D context to it
let canvas = document.getElementById("canvasSystem");
let ctx = canvas.getContext("2d");



let stuff;

// let jqNASA = $.ajax({
//   url: "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=distinct%20pl_name&format=json",
//
//
// }).done((result) => stuff = JSON.parse(result));
//
// console.log(jqNASA);

// Classes -- SolarSystem class is a container class for StellarObject objects
//  -- Star, Planet and Moon inherit from superclass StellarObject

class SolarSystem {

  constructor(star, planets){
    this.star = new Star();
    this.planets = [];
  }
}

class StellarObject {
  constructor(x, y, r){
    // this.x = x;
    // this.y = y;
    // this.r = r;
  }
}

class Star extends StellarObject {
  constructor(){
    super();

    // known parameters of an elliptic orbit found in the NASA database
    this.ecc = 0.75;
    this.semiMajor = Math.floor(Math.random() * 240);
    this.semiMinor = Math.sqrt(Math.pow(this.semiMajor, 2) * (1 - Math.pow(this.ecc, 2)));

    //foci
    this.foci = Math.sqrt(Math.pow(this.semiMajor, 2) - Math.pow(this.semiMinor, 2));
  }

  draw(){
    let g = ctx.createRadialGradient(320 - this.foci, 320, 4, 320 - this.foci, 320, 32);
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

    // known parameters of an elliptic orbit found in the NASA database
    this.ecc = 0.75;
    this.semiMajor = Math.floor(Math.random() * 480);
    this.semiMinor = Math.sqrt(Math.pow(this.semiMajor, 2) * (1 - Math.pow(this.ecc, 2)));

    //foci
    this.foci = Math.sqrt(Math.pow(this.semiMajor, 2) - Math.pow(this.semiMinor, 2));

    // Give the planet a random theta and velocity
    this.theta = Math.random() * 2 * Math.PI;
    this.dtheta = Math.random() / 25;
    // this.radius = Math.floor(Math.random() * 240) + 32;

    // calculate radius from a given (initially random) theta and some terrifying crazy ellipse math
    this.radius = this.semiMajor * (1 - Math.pow(this.ecc, 2)) / (1 + (this.ecc * Math.cos(this.theta)))

    //convert polar (theta, radius) to cartesian (x, y)
    this.x = (Math.cos(this.theta) * this.radius) + 320 + this.foci;
    this.y = (Math.sin(this.theta) * this.radius) + 320;

    this.trailLength = 64;
    this.trailPositions = [];
  }

  draw(){
    this.update();
    this.drawOrbit(this.radius);
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
    ctx.ellipse(320, 320, this.semiMajor, this.semiMinor, 0, 0, 2 * Math.PI, false)
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

    this.x = (Math.cos(this.theta) * this.radius) + 320 + this.foci;
    this.y = (Math.sin(this.theta) * this.radius) + 320;

    this.theta += this.dtheta;
    // this.radius = this.semiMajor * (1 - Math.pow(this.ecc, 2)) / (1 + Math.cos(this.theta));
    this.radius = this.semiMajor * (1 - Math.pow(this.ecc, 2)) / (1 + (this.ecc * Math.cos(this.theta)))

    console.log(this.semiMajor);
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
