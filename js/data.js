"use strict"

initAudio();

let appData;
let distinctStars;
let distinctPlanets;
let planetsUsable;
let systemSizes = [];

// Total distinct star count in the SQL data
let urlDistinctStars = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=distinct%20pl_hostname,pl_pnum&order=pl_hostname&format=json";

// Total exoplanets count in the SQL data
let urlDistinctPlanets = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_hostname&format=json";

// Total binary extrasolar systems

//
let urlSystemPlanetCounts = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_pnum&format=json";

// Total usable stars and planets -- Orbital semi-major axis and eccenttricty !== null in the SQL data
let urlUsablePlanets = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_cbflag,pl_hostname,pl_letter,pl_orbsmax,pl_orbeccen&where=pl_orbsmax%20is%20not%20%20null%20and%20pl_orbeccen%20is%20not%20null&order=pl_hostname,pl_letter&format=json";
// Total usable "solo" and binary star systems


function initAJAX() {
  distinctStars = $.getJSON(urlDistinctStars);
  distinctStars.done((data) => {
    distinctStars = data;
    initDataStars();
  });

  distinctPlanets = $.getJSON(urlDistinctPlanets);
  distinctPlanets.done((data) => {
    distinctPlanets = data;
    initDataPlanets()
  })
}

function initDataStars() {
  $("#tdStarCount").text(distinctStars.length);
}

function initDataPlanets() {
  $("#tdPlanetCount").text(distinctPlanets.length);

  let sizes = $.getJSON(urlSystemPlanetCounts);
  sizes.done((data) => {
    let objSizeCounters = {};

    for (let i of data) {
      if (!systemSizes.includes(i.pl_pnum)) systemSizes.push(i.pl_pnum)
    }

    console.log(distinctStars);

    for (let size of systemSizes) {
      for (let star of distinctStars) {
        if (objSizeCounters[size]) {
          objSizeCounters[size++];
        } else {
          objSizeCounters[size] = 1;
        }
        console.log(objSizeCounters[size]);
      }

      let $tr = `<tr><td>Systems Containing ${size} Planets</td><td>${objSizeCounters[size]}</td></tr>`;
      $("#tbodyPlanetCounts").append($tr);
    }
  });

  //planetsUsable = $.getJSON(urlUsablePlanets, (data) => data.forEach((planet) => $("#tdPlanetCount").text(data.length)));

  for (let size of systemSizes) {

  }
}

initAJAX();
