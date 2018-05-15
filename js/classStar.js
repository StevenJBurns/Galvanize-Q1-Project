"use strict";

export class Star {
  constructor(binary, mass, radius, temperature) {
    this.isBinary = binary;
    this.mass = mass || 0;
    this.radius = radius || 0;
    this.temperature = temperature;
    this.planets = [];

    // For binaryDraw() method only !!!
    this.thetaA = (Math.random() * Math.PI) + Math.PI;
    this.thetaB = this.thetaA - Math.PI;
    this.dtheta = 0.0075;

    this.polarRadiusA = 24;
    this.polarRadiusB = 32;
    this.xA, this.yA, this.xB, this.yB;
  }
}
