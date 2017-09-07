"use strict";

// Global Variables --------------------------------------------------------------------------- Start
// Global Variables --------------------------------------------------------------------------- End

// Classes ------------------------------------------------------------------------------------ Start
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
