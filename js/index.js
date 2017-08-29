"use strict"

// Get the audio element that plays the background space ambience file
let audioBackground = document.getElementById("audioBackground");

// check if local storage contains a key for "sound" status to handle global muting/unmuting
// On the first-time creation, set it to "on" to annoy first time visitors
if (localStorage.getItem("sound") === null) localStorage.setItem("sound", "on") // : localStorage.setItem("sound", "off")

// Simple -- Flip the Boolean value of "muted" on the Audio element on button click
// Eventhandler is attached to the button as onClick attribute in the Audio element
// Then save the audio state to localStorage as "on" or "off" to be used in initAudio()
function toggleSound(){
  audioBackground.muted ? audioBackground.muted = false : audioBackground.muted = true;
  $("#buttonAudio").toggleClass("button-success button-warning")
  audioBackground.muted ? localStorage.setItem("sound", "off") : localStorage.setItem("sound", "on");
}

function initAudio(){
  switch (localStorage.getItem("sound")) {
    case "on":
      audioBackground.muted = false;
      $("#buttonAudio").addClass("button-success");
      $("#buttonAudio").removeClass("button-warning");
      break;
    case "off":
      audioBackground.muted = true;
      $("#buttonAudio").addClass("button-warning");
      $("#buttonAudio").removeClass("button-success");
      break;
    default:
      audioBackground.muted = true;
  }
}

initAudio();

let divWrapper = document.getElementById("canvas-wrapper");
let canvas = document.getElementById("canvas-starfield");
let ctx = canvas.getContext("2d");
let stars;

canvas.width = innerWidth;
canvas.height = $(window).height() - ($("header").outerHeight() + $("footer").outerHeight());

$(window).resize(resizeCanvas);

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = $(window).height() - ($("header").outerHeight() + $("footer").outerHeight());

  init();
}

function init(){
  stars = [];

  for (let i = 0; i < 767; i++){
    let s = new Star(Math.floor(Math.random() * ctx.canvas.width), Math.floor(Math.random() * ctx.canvas.height));
    stars.push(s);
  }
}

class Star {
  constructor(randomX, randomY){
    this.x = randomX;
    this.y = randomY;
    this.opacity = Math.random();
  }

  draw(){
    this.update();

    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

  update(){
    this.x -= this.opacity * 1.0;

    if (this.x <= 0){
      this.x = ctx.canvas.width;
    }
  }
}

function animateStarfield(){
  window.requestAnimationFrame(animateStarfield);

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for(let s of stars){
    s.draw();
  }
}

init();
animateStarfield();
