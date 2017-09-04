"use strict";

// Global Variables --------------------------------------------------------------------------- Start
let appData;

// Raw and Modified Star & Planet array containers
let distinctStars;
let distinctPlanets;

let usableStars;
let usablePlanets;

let sizesOfSolarSystems;
let uniqueSolarSystemSizes;


// API URL to get distinct star info from the SQL data; Just a subset -- the NASA database contains more info than we need
let urlDistinctStars = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=distinct%20pl_hostname,pl_cbflag,pl_pnum,st_mass,st_rad,st_dist,st_mass,st_rad,st_teff&order=pl_hostname&format=json";

// API URL to get distinct planet info from the SQL data; Just a subset -- the NASA database contains more info than we need
let urlDistinctPlanets = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_hostname,pl_letter,pl_pnum,pl_orbper,pl_orbsmax,pl_orbeccen&format=json";
// Global Page Variables ---------------------------------------------------------------------- End


// Functions ---------------------------------------------------------------------------------- Start

// Starting point to coalesce the data into usable, hierarchical objects -- the asynchronous AJAX calls need to be "timed"
// Also contains a function to check last AJAX calls, localStorage cache of the data to avoid hammering the NASA API server
function initAJAX() {
  // This waits for the Star and Planet API calls (below) to both finish then start normalizing the flat data to hierarchical data
  //$(document).ajaxStop();

  // AJAX API call to get all star data
  distinctStars = $.getJSON(urlDistinctStars);
  distinctStars.done((data) => {
    distinctStars = data;
    initDataStars();
    $("#tdStarCountRaw").text(distinctStars.length);
  });

  // AJAX API call to get all planet data
  distinctPlanets = $.getJSON(urlDistinctPlanets);
  distinctPlanets.done((data) => {
    distinctPlanets = data;
    initDataPlanets();
    $("#tdPlanetCountRaw").text(distinctPlanets.length);
  });
}

// After collecting all star data, start filtering it
function initDataStars() {
  // Count single-system and multi-star systems and put the counter in the table-rows on data.html
  let counterSingleSystemStars = 0;
  let counterMultiSystemStars = 0;

  for (let star of distinctStars) {
    star['pl_cbflag'] === 0 ? counterSingleSystemStars++ : counterMultiSystemStars++
  }

  let $trSingle = `<tr><td>Single-Star Systems</td><td>${counterSingleSystemStars}</td></tr>`;
  let $trBinary = `<tr><td>Multi-Star Systems</td><td>${counterMultiSystemStars}</td></tr>`;

  $("#tbodyCircumbinaryCounts").append($trSingle);
  $("#tbodyCircumbinaryCounts").append($trBinary);

}

function sumSolarSystemSizes() {

}

// After collecting and filtering star data, filter and push planet data to its respective parent star object
function initDataPlanets() {
  // Count and display solar system sizes (pl_pnum from the SQL data) as "groups" -- Also inject a table row with that data into the table on the data page
  // Set is like Array but only keeps unique values, ignores duplicates -- great for finding distinct groups in this case
  uniqueSolarSystemSizes = new Set();
  sizesOfSolarSystems = [];

  distinctPlanets.forEach((planet) => uniqueSolarSystemSizes.add(planet.pl_pnum));

  sizesOfSolarSystems = [...uniqueSolarSystemSizes].sort().map((size, index) => {return {"solarSystemSize" : size, "count" : 0};});

  for (let size of sizesOfSolarSystems) {
    for (let planet of distinctPlanets) {
      if (planet.pl_pnum === size["solarSystemSize"]) size["count"]++;
    }
    let $tr = `<tr><td>Systems Containing ${size["solarSystemSize"]} Planets</td><td>${size["count"]}</td></tr>`;
    $("#tbodyPlanetCounts").append($tr);
  }


  // All initial raw star data is now presented on the page.
  // Now we slice and dice the distinctStars variable to filter out unusable data
  // let removedStars = [];
  // for (let star of distinctStars) {
  //   if (!star["st_mass"]) {
  //     let index = distinctStars.indexOf(star);
  //
  //     if (index > -1) removedStars.push(distinctStars.splice(index, 1)[0]);
  //   }
  // }

  // for (let star of distinctStars) {
  //   if (!star["st_rad"]) {
  //     let index = distinctStars.indexOf(star);
  //
  //     if (index > -1) removedStars.push(distinctStars.splice(index, 1)[0]);
  //   }
  // }
  //
  // $("#h4RemovingStars").text(`Removing ${removedStars.length} stars that do not have data for Mass or Radius`);
  // $("#tdStarCountModified").text(distinctStars.length);
  //
  // let removedPlanets = [];
  // for (let planet of distinctPlanets) {
  //
  //   if (!removedStars.includes(planet)) {
  //     let index = distinctPlanets.indexOf(planet);
  //
  //     if (index > -1) removedPlanets.push(distinctPlanets.splice(index, 1));
  //   }
  // }
  // $("#tdPlanetCountModified").text(removedPlanets.length);
}

initAudio();
//initData();
initAJAX();
