"use strict";

let timeAPI;
let nextAPI;
let timeNow = new Date();

// Check if localStorage has a stored value for the last AJAX API call
// if no, set it to NOW; If yes, update it to stored time
localStorage["lastCallToAPI"] === null ? timeAPI = Date.parse(localStorage.getItem("timeAPI")) : localStorage.setItem("lastCallToAPI", timeNow.toString())


// Global Variables --------------------------------------------------------------------------- Start
let appData;

let distinctStars;
let distinctPlanets;

let usableStar;
let usablePlanets;

let systemSizes = [];


// Total distinct star count in the SQL data
//let urlDistinctStars = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=distinct%20pl_hostname,pl_pnum,pl_cbflag,st_mass,st_rad&order=pl_hostname&format=json";

// Total exoplanets count in the SQL data
//let urlDistinctPlanets = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_hostname&format=json";
// Global Variables --------------------------------------------------------------------------- End



// Total binary extrasolar systems

//
//let urlSystemPlanetCounts = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_pnum&format=json";

// Total usable stars and planets -- Orbital semi-major axis and eccenttricty !== null in the SQL data
//let urlUsablePlanets = "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_cbflag,pl_hostname,pl_letter,pl_orbsmax,pl_orbeccen&where=pl_orbsmax%20is%20not%20%20null%20and%20pl_orbeccen%20is%20not%20null&order=pl_hostname,pl_letter&format=json";
// Total usable "solo" and binary star systems
