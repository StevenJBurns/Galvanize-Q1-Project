"use strict"

// Get the audio element that plays the background space ambience file
let audioBackground = document.getElementById("audioBackground");

// check if local storage contains a key for "sound" status to handle global muting/unmuting
// On the first-time creation, set it to "on" to annoy first time visitors
if (localStorage.getItem("sound") === null) localStorage.setItem("sound", "on") // : localStorage.setItem("sound", "off")

// Simple -- Flip the Boolean value of "muted" on the Audio element on button click
// Eventhandler is attached to the button as onClick attribute in the Audio element
// Then save the audio state to localStorage as "on" or "off" to be used in initAudio()
function toggleSound(){
  audioBackground.muted ? audioBackground.muted = false : audioBackground.muted = true;
  $("#buttonAudio").toggleClass("button-success button-warning")
  audioBackground.muted ? localStorage.setItem("sound", "off") : localStorage.setItem("sound", "on");
}

function initAudio(){
  switch (localStorage.getItem("sound")) {
    case "on":
      audioBackground.muted = false;
      $("#buttonAudio").addClass("button-success");
      $("#buttonAudio").removeClass("button-warning");
      break;
    case "off":
      audioBackground.muted = true;
      $("#buttonAudio").addClass("button-warning");
      $("#buttonAudio").removeClass("button-success");
      break;
    default:
      audioBackground.muted = true;
  }
}

initAudio();
