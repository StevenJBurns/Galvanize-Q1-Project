"use strict";

export class SolarSystem {
  constructor(name, dist, planetCount) {
    this.systemName = name || "";
    this.distanceFromEarth = dist || 0;
    this.planetCount = planetCount || 0;
    this.star = {};
    this.planets = [];
}
