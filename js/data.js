"use strict";

// Global Variables --------------------------------------------------------------------------- Start
// Global Variables --------------------------------------------------------------------------- End

// Classes ------------------------------------------------------------------------------------ Start

// Same class as Star from the visualization.js file but without all the drawing methods
class Star {
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

// Same class as Planet from the visualization.js file but without all the drawing methods
class Planet {
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

// Classes ------------------------------------------------------------------------------------ End


// Functions ---------------------------------------------------------------------------------- Start

// Page-specific function to attach global data to page elements
function updatePageElements() {
  // Update HTML tables with raw star and planet counts
  $("#tdStarCountRaw").text(dataStars.length);
  $("#tdPlanetCountRaw").text(dataPlanets.length);

  // Get single-star vs multi-star data and display it in the tables on the data.html page
  let counterSingleSystemStars = 0;
  let counterMultiSystemStars = 0;

  for (let star of dataStars) star['pl_cbflag'] === 0 ? counterSingleSystemStars++ : counterMultiSystemStars++;

  $("#tbodyCircumbinaryCounts").append(`<tr><td>Single-Star Systems</td><td align="right">${counterSingleSystemStars}</td></tr>`);
  $("#tbodyCircumbinaryCounts").append(`<tr><td>Multi-Star Systems</td><td align="right">${counterMultiSystemStars}</td></tr>`);

  // Count and display solar system sizes (pl_pnum from the SQL data) as "groups" -- Also inject a table row with that data into the table on the data page
  // Set is like Array but only keeps unique values, ignores duplicates -- great for finding distinct groups in this case
  uniqueSolarSystemSizes = new Set();
  sizesOfSolarSystems = [];

  dataStars.forEach((star) => uniqueSolarSystemSizes.add(star.pl_pnum));

  // Convert the Set of Sizes to an array, sort it, then map that array to objects each initialized to a zero count
  sizesOfSolarSystems = [...uniqueSolarSystemSizes].sort().map((size, index) => {return {"solarSystemSize" : size, "count" : 0};});

  // Count the # of systems in a catgeory of sizes (confused yet?) and update the HTML table on the data.html page
  for (let size of sizesOfSolarSystems) {
    for (let star of dataStars) {
      if (star.pl_pnum === size["solarSystemSize"]) size["count"]++;
    }
    let $tr = `<tr><td>Systems Containing ${size["solarSystemSize"]} Planets</td><td align="right">${size["count"]}</td></tr>`;
    $("#tbodyPlanetCounts").append($tr);
  }

  // $("#h4RemovingStars").text(`Removing ${removedStars.length} stars that do not have data for Mass or Radius`);
  // $("#tdStarCountModified").text(distinctStars.length);
}

// Start The Page Code  --------------------------------------------------------------------------- Start

initAudio();
// initLocalStorage();
initAJAX();
