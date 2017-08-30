"use strict"

initAudio();

let appData;
let starsDistinct;
let planetsUsable;

let jqNASA = $.ajax({
  url: "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=distinct%20pl_hostname&order=pl_hostname&format=json",
}).done((result) => starsDistinct = JSON.parse(result));



// Total distinct star count in the SQL data
let urlDistinctStars = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=distinct%20pl_hostname&order=pl_hostname&format=json";
// Total exoplanets count in the SQL data
let urlDistinctPlanets = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_hostname&format=json";
// Total binary extrasolar systems

// Total usable stars and planets -- Orbital semi-major axis and eccenttricty !== null in the SQL data

// Total usable "solo" and binary star systems

function initStars() {

}

function initPlanets() {

}

function initData() {
  //let urlUsablePlanets = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_cbflag,pl_hostname,pl_letter,pl_orbsmax,pl_orbeccen&where=pl_orbsmax%20is%20not%20%20null%20and%20pl_orbeccen%20is%20not%20null&order=pl_hostname,pl_letter&format=json"

  starsDistinct = $.getJSON(urlDistinctStars, (data) => $("#tdStarCount").text(data.length));
  planetsDistinct = $.getJSON(urlDistinctPlanets, (data) => $("#tdPlanetCount").text(data.length));
  //planetsUsable = $.getJSON(urlUsablePlanets, (data) => data.forEach((planet) => $("#tdPlanetCount").text(data.length)));

}

initData();
