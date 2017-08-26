"use strict"

let canvas = document.getElementById("canvas-starfield");
let ctx = canvas.getContext("2d");

let stars;

function init(){
  stars = [];

  for (let i = 0; i < 100; i++){
    let s = new Star(Math.floor(Math.random() * 300), Math.floor(Math.random() * 300));
    stars.push(s);
  }
}

class Star {
  constructor(randomX, randomY){
    this.x = randomX;
    this.y = randomY;
  }

  draw(){
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }
}

function animateStarfield(){
  // window.requestAnimationFrame(animateStarfield);

  ctx.fillStyle = "#000000";
  ctx.fillRect(0,0,640,640);

  for(let s of stars){
    s.draw();
    console.log(s)
  }
}

init();
animateStarfield();
