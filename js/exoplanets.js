"use strict"

let canvas = document.getElementById("canvasSystem");
let ctx = canvas.getContext("2d");

fillCanvas();
drawStar();
drawPlanet();
drawPlanet();

function fillCanvas(){
  ctx.fillStyle = "black";   //rgb(randomR, randomG, randomB);
  ctx.fillRect(0,0,640,640);
}

function drawStar(){
ctx.fillStyle = createRandomColorRGB()
  ctx.beginPath();
  ctx.arc(320, 320, 24, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function drawPlanet(){
  ctx.fillStyle = createRandomColorRGB();
  let x = Math.floor(Math.random() * 320) + 160;
  let y = Math.floor(Math.random() * 320) + 160;

  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

function createRandomColorRGB(){
  let randomR = Math.floor(Math.random() * 255);
  let randomG = Math.floor(Math.random() * 255);
  let randomB = Math.floor(Math.random() * 255);

  console.log(randomR, randomG, randomB);

  return `rgb(${randomR},${randomG},${randomB})`
}
