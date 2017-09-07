"use strict";

// Check if localStorage has a stored value for the last AJAX API call
// if no, set it to NOW; If yes, update it to stored time

// Global Variables --------------------------------------------------------------------------- Start

// Raw and Modified Star & Planet array containers
let dataStars;
let dataPlanets;

let sizesOfSolarSystems;
let uniqueSolarSystemSizes;

let dataNormalized;

// API URL to get distinct star info from the SQL data; Just a subset -- the NASA database contains far more info than we need
let urlDistinctStars = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=distinct%20pl_hostname,pl_cbflag,pl_pnum,st_mass,st_rad,st_teff,st_dist&order=pl_hostname&format=json";

// API URL to get distinct planet info from the SQL data; Just a subset -- the NASA database contains far more info than we need
let urlDistinctPlanets = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_hostname,pl_letter,pl_orbeccen,pl_orbsmax,pl_orbper&format=json";

// Global Variables --------------------------------------------------------------------------- End

// Classes ------------------------------------------------------------------------------------ Start

class SolarSystem {
  constructor(star) {
    this.systemName = star.pl_hostname || "";
    this.distanceToEarth = star.st_dist || 0;
    this.planetCount = star.pl_pnum || 0;
    this.star = {};
    this.planets = [];
  }
}

// Classes ------------------------------------------------------------------------------------ End

// Functions ---------------------------------------------------------------------------------- Start

function initLocalStorage() {
  localStorage["lastCallToAPI"] ? timeAPI = Date.parse(localStorage.getItem("lastCallToAPI")) : localStorage.setItem("lastCallToAPI", new Date().toString())

}

// Starting point to coalesce the data into usable, hierarchical objects -- the asynchronous AJAX calls need to be "timed"
// Also contains a function to check last AJAX calls, localStorage cache of the data to avoid hammering the NASA API server
function initAJAX() {
  // This waits for the Star and Planet API calls to both finish before running the normalizeData() function to normalizing the flat data back to hierarchical data
  $.when($.getJSON(urlDistinctStars), $.getJSON(urlDistinctPlanets)).done(normalizeData);
}

// This function runs after the initAJAX() entry point collects raw data for both stars and planets
// First, it displays some basic stats about the raw data in the HTML tables.  Then it normalizes the stars and planets together in one object
function normalizeData(stars, planets) {
  // The "data" of the AJAX calls is returned as arrays at index 0 -- assign to variables for use in all the codez!
  dataStars = stars[0];
  dataPlanets = planets[0];

  dataNormalized = [];

  // Start building hierarchical solar systems from the raw star and planet data -- store them as an array of objects in dataNormalized
  // dataNormalized will be an array of SolarSystem objects -- each star will be a property of a SolarSystem --
  // Each planet will be an object in an array -- that array will be a property of the SolarSystem (i.e. solarSystem.planets)
  // The properties of stars and planets will be changed for readability and moved to the SolarSystem level if it makes sense
  for (let star of dataStars) {
    let newSystem = new SolarSystem(star);
    let tempStar = {"isMultiStar" : `${star.pl_cbflag}`,
                    "mass" : `${star.st_mass}`,
                    "radius" : `${star.st_rad}`,
                    "temperature" : `${star.st_teff}`};

    newSystem.star = tempStar;

    for (let planet of dataPlanets) {
      if (planet.pl_hostname == star.pl_hostname) {
        let tempPlanet = {"name" : `${star.pl_hostname} ${planet.pl_letter}`,
                          "orbitalEccentricity" : `${planet.pl_orbeccen}`,
                          "orbitalSemiMajorAxis" : `${planet.pl_orbsmax}`,
                          "orbitalPeriod" : `${planet.pl_orbper}`};

        newSystem.planets.push(tempPlanet);
      }
    }
    dataNormalized.push(newSystem);
  }
  updatePageElements();
}
