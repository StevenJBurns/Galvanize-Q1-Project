"use strict";

export class Planet {
  constructor(name, ecc, smAxis, period) {
    // known parameters of an elliptic orbit found in the NASA database
    this.name = name || "";
    this.ecc = ecc || 0;  // = (Math.random() * 0.75) + 0.25;
    this.semiMajor = smAxis * 256 || 1;  // Math.floor(Math.random() * 240);
    this.semiMinor = Math.sqrt(Math.pow(this.semiMajor, 2) * (1 - Math.pow(this.ecc, 2)));  // Not given; calculated once semiMajor is known
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
}
