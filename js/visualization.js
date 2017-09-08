"use strict";

// Find the canvas via the DOM and get a 2D context to it
let divWrapper = document.getElementById("canvas-wrapper");
let canvas = document.getElementById("canvas-visualizer");
let ctx;

let runCanvasAnimation;
let currentSolarSystem;

canvas.width = $(window).width() - $("#visualization-sidepanel").innerWidth();
canvas.height = $(window).height() - ($("header").outerHeight() + $("footer").outerHeight());

// let ken = new Image();
// ken.src = "images/ken.png";


// Event Listeners ---------------------------------------------------------------------------- Start

$(window).resize(resizeCanvas);

$("#selectSolarSystem").on("change", handleSelectSolarSystem);

// Event Listeners ---------------------------------------------------------------------------- End

// Classes ------------------------------------------------------------------------------------ Start

class Star {
  constructor(binary, mass, radius, temperature) {
    this.isBinary = binary;
    this.mass = mass || 0;
    this.radius = radius || 0;
    this.temperature = temperature;
    this.planets = [];
  }

  draw() {
    this.update();
    this.isBinary ? this.drawBinary() : this.drawSingle();
  }

  drawSingle() {
    let g = ctx.createRadialGradient(320, 320, 4, 320, 320, 28);
    g.addColorStop(0, "#FFFF99");
    g.addColorStop(0.05, "#FFFF99")
    g.addColorStop(1, "#000000");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  drawBinary() {

  }

  update() {

  }
}

class Planet {
  constructor(name, ecc, smAxis, period) {
    // known parameters of an elliptic orbit found in the NASA database
    this.name = name || "";
    this.ecc = ecc || 0;  // = (Math.random() * 0.75) + 0.25;
    this.semiMajor = smAxis * 256 || 1;  // Math.floor(Math.random() * 240);
    this.semiMinor = Math.sqrt(Math.pow(this.semiMajor, 2) * (1 - Math.pow(this.ecc, 2)));
    this.period = period || 365;

    //foci
    this.foci = Math.sqrt(Math.pow(this.semiMajor, 2) - Math.pow(this.semiMinor, 2));

    // Give the planet a random theta and angular velocity based on Period
    this.theta = Math.random() * 2 * Math.PI;
    this.dtheta = 1 / (4 * this.period);        // Math.random() / 20;

    // calculate radius from a given (initially random) theta and some terrifying crazy ellipse math
    this.radius = this.semiMajor * (1 - Math.pow(this.ecc, 2)) / (1 + (this.ecc * Math.cos(this.theta)))

    //convert polar (theta, radius) to cartesian (x, y)
    this.x = (Math.cos(this.theta) * this.radius) + 320 + this.foci;
    this.y = (Math.sin(this.theta) * this.radius) + 320;

    this.trailLength = 128;
    this.trailPositions = [];
  }

  draw() {
    this.update();
    this.drawOrbit(this.radius);
    this.drawTrail();

    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 4, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();

    // ctx.drawImage(ken, this.x, this.y, 32, 32)
  }

  drawOrbit(r) {
    ctx.strokeStyle = "#3F3F3F";
    ctx.beginPath();
    ctx.ellipse(320 + this.foci, 320, this.semiMajor, this.semiMinor, 0, 0, 2 * Math.PI, false)
    ctx.stroke();
  }

  // Use the trailPositions array to store
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

  // Update the "numbers" before drawing
  update(){
    if (this.theta >= (2 * Math.PI)) this.theta = 0;

    // Push the current x-y position into the array to generate a motion trail in drawTrail() function
    // Also, take the last planet motion trail particle out of the array with shift()
    this.trailPositions.push({x: this.x, y: this.y});
    if (this.trailPositions.length > this.trailLength) this.trailPositions.shift();

    // convert polar coordinates (radius and theta) to Cartesian canvas coordinates (x, y)
    this.x = (Math.cos(this.theta) * this.radius) + 320 + (2 * this.foci);
    this.y = (Math.sin(this.theta) * this.radius) + 320;

    // update theta for the next draw() pass; the angle produces acceleration effect AND radius is not available until theta is set
    this.theta += this.dtheta;
    this.radius = this.semiMajor * (1 - Math.pow(this.ecc, 2)) / (1 + (this.ecc * Math.cos(this.theta)))
  }
}

class BackgroundStarfield {
  constructor(){
    this.stars = [];

    for (let i = 0; i < 256; i++){
      let s = {"starTheta" : Math.random() * 2 * Math.PI,
               "starRadius" : Math.random() * (canvas.width / 1.5) + 96,
               "opacity" : Math.random() / 1.5};
      this.stars.push(s);
      }
    }

    draw(){
      this.update();

      for (let s of this.stars){
        let x = Math.cos(s.starTheta) * s.starRadius + 320;
        let y = Math.sin(s.starTheta) * s.starRadius + 320;

        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
      }
    }

    update(){
      for (let s of this.stars){
        s.starTheta -= 0.00075;
      }
    }
  }
  // Classes ------------------------------------------------------------------------------------ End

  // Functions ---------------------------------------------------------------------------------- Start

// Page-specific function to attach global data to page elements
function updatePageElements() {
  for (let system of dataNormalized) {
    let newOption = `<option value="${system.systemName}">${system.systemName}</option>`;

    $("#selectSolarSystem").append(newOption);
  }
  initAnimation();
}

function resizeCanvas(){
  canvas.width = $(window).width() - $("#visualization-sidepanel").innerWidth();
  canvas.height = $(window).height() - ($("header").outerHeight() + $("footer").outerHeight());
}

function handleSelectSolarSystem() {
  // Stop the canvas animation and get ready to draw a new solar system
  runCanvasAnimation = false;
  currentSolarSystem = dataNormalized.find((system) => {return system.systemName == this.value});

  $("#h4-SelectedSystemName").text(`Selected System : ${currentSolarSystem["systemName"]}`);
  $("#h5-SelectedSystemDistance").text(`Distance from Earth : ${currentSolarSystem["distanceFromEarth"]} parsecs`);
  $("#h5-SelectedSystemBinary").text(`Multi-Star System : ${!!+currentSolarSystem["star"].isBinary}`); // the !!+ is a nifty trick to turn 0/1 to true/false;
  $("#h5-SelectedSystemCount").text(`Planet Count : ${currentSolarSystem["planetCount"]}`);

  $("#ul-PlanetList").empty();
  for (let planet of currentSolarSystem["planets"]) {
    let newPlanet = `<li>${planet["name"]}</li>`;
    $("#ul-PlanetList").append(newPlanet);
  }
  console.log(currentSolarSystem.getLargestPlanetRadius());
}

function initAnimation() {
  ctx = canvas.getContext("2d");
  runCanvasAnimation = true;
  bgStars = new BackgroundStarfield();

  if (!currentSolarSystem) {
    currentSolarSystem = dataNormalized[Math.floor(Math.random() * dataNormalized.length)];
  }

  animateCanvas();
}

// Animation of the Canvas element
function animateCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,ctx.canvas.height,ctx.canvas.width);

  if (!runCanvasAnimation) {
    ctx = null;
    bgStars = null;
    initAnimation();
    return;
  }

  requestAnimationFrame(animateCanvas);

  currentSolarSystem.star.draw();
  currentSolarSystem.planets.forEach((planet) => planet.draw());
  bgStars.draw();
}

// Test Background, Star & Planets
let bgStars;

initAudio();
// initLocalStorage();
initAJAX();
