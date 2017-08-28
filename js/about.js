"use strict"

// Get the audio element that plays the background space ambience file
let audioBackground = document.getElementById("audioBackground");
// check if local storage contains a key for "sound" status to handle global muting/unmuting
// On the first-time creation, set it to "on" to annoy first time visitors
localStorage.getItem("sound") === null ? localStorage.setItem("sound", "on") : localStorage.setItem("sound", "off")

//
function toggleSound(){
  return audioBackground.muted ? audioBackground.muted = false  : audioBackground.muted = true;
}
