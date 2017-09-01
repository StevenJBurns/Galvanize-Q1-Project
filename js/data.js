"use strict"

// Global Page Variables
let appData;
let distinctStars;
let distinctPlanets;
let planetsUsable;
let systemSizes = [];

// Total distinct star count in the SQL data
let urlDistinctStars = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=distinct%20pl_hostname,pl_pnum,pl_cbflag,st_mass,st_rad&order=pl_hostname&format=json";

// Total exoplanets count in the SQL data
let urlDistinctPlanets = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_hostname&format=json";

// Total binary extrasolar systems

//
let urlSystemPlanetCounts = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_pnum&format=json";

// Total usable stars and planets -- Orbital semi-major axis and eccenttricty !== null in the SQL data
let urlUsablePlanets = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_cbflag,pl_hostname,pl_letter,pl_orbsmax,pl_orbeccen&where=pl_orbsmax%20is%20not%20%20null%20and%20pl_orbeccen%20is%20not%20null&order=pl_hostname,pl_letter&format=json";
// Total usable "solo" and binary star systems

// Starting point to coalesce the data into usable, hierarchical objects -- the asynchronous AJAX calls need to be "timed"
// Also contains a function to check last AJAX calls, localStorage cache of the data to avoid hammering the NASA API server
function initAJAX() {
  distinctStars = $.getJSON(urlDistinctStars);
  distinctStars.done((data) => {
    distinctStars = data;
    initDataStars();
  });
}

// After collecting all star data, start filtering it
function initDataStars() {
  $("#tdStarCountRaw").text(distinctStars.length);

  let starsSingle = 0;
  let starsBinary = 0;
  for (let star of distinctStars) {
    star['pl_cbflag'] === 0 ? starsSingle++ : starsBinary++
  }

  let $trSingle = `<tr><td>Single-Star Systems</td><td>${starsSingle}</td></tr>`;
  let $trBinary = `<tr><td>Binary-Trinary Systems</td><td>${starsBinary}</td></tr>`

  $("#tbodyCircumbinaryCounts").append($trSingle);
  $("#tbodyCircumbinaryCounts").append($trBinary);

  let sizes = $.getJSON(urlSystemPlanetCounts);
  sizes.done((data) => {
    let objSizeCounters = {};

    for (let i of data) {
      if (!systemSizes.includes(i.pl_pnum)) systemSizes.push(i.pl_pnum)
    }

    // Sort the "sizes" array so the table shows the planet counts in order
    systemSizes.sort();

    // Count the # of planets per solar system and group them by adding a property to the star objects
    // Also inject a table row with that data into the table on the data page
    for (let size of systemSizes) {
      for (let pnum of distinctStars) {
        (!objSizeCounters[size]) ? objSizeCounters[size] = 1 : objSizeCounters[pnum["pl_pnum"]]++
        }

      let $tr = `<tr><td>Systems Containing ${size} Planets</td><td>${objSizeCounters[size] - 1}</td></tr>`;
      $("#tbodyPlanetCounts").append($tr);
    }
  });

  distinctPlanets = $.getJSON(urlDistinctPlanets);
  distinctPlanets.done((data) => {
    distinctPlanets = data;
    initDataPlanets()
  });
}

// After collecting and filtering star data, filter and push planet data to its respective parent star object
function initDataPlanets() {
  $("#tdPlanetCountRaw").text(distinctPlanets.length);

  // All initial raw star data is now presented on the page.
  // Now we slice and dice the distinctStars variable to filter out unusable data
  let removedStars = [];
  for (let star of distinctStars) {
    if (!star["st_mass"]) {
      let index = distinctStars.indexOf(star);

      if (index > -1) removedStars.push(distinctStars.splice(index, 1)[0]);
    }
  }

  for (let star of distinctStars) {
    if (!star["st_rad"]) {
      let index = distinctStars.indexOf(star);

      if (index > -1) removedStars.push(distinctStars.splice(index, 1)[0]);
    }
  }

  console.log(distinctStars);

  $("#h4RemovingStars").text(`Removing ${removedStars.length} stars that do not have data for Mass or Radius`);
  $("#tdStarCountModified").text(distinctStars.length);

  let removedPlanets = [];
  // console.log(removedStars);
  for (let planet of distinctPlanets) {
    if (!removedStars.includes(planet)) {
      let index = distinctPlanets.indexOf(planet);

      if (index > -1) removedPlanets.push(distinctPlanets.splice(index, 1));
    }
  }
  $("#tdPlanetCountModified").text(removedPlanets.length);

  console.log(distinctStars);

  for (let star of distinctStars) {
    for (let planet of distinctPlanets) {
    }
  }
}

initAudio();
//initData();
initAJAX();
