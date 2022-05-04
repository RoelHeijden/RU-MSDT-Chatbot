/*
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
*/

// Drop down menu

// Variables for drop down menu
var faqModal = document.getElementById("faqScreen");
var faqSpan = document.getElementsByClassName("modal-close")[1];
var languageModal = document.getElementById("ChangeLanguage");
var languageSpan = document.getElementsByClassName("modal-close")[2];
var helpModal = document.getElementById("helpInfo");
var helpSpan = document.getElementsByClassName("modal-close")[3];
// the constant languages represents the languages in which the chatbot can respond
const languages = ['English'];
var state = false;

/** function that displays the drop down menu after the icon has been clicked
 * @param = none.
 * @return = none.
 */
function dropDownMenu() {
  state = !state;
  if (state) {
    document.getElementById("dropmenu").style.display = "block";
  } else {
    document.getElementById("dropmenu").style.display = "none";
  }
}

/** fuction that hides the drop down menu after using one of the buttons
 * @param = none.
 * @return = none.
 */
function itemClick() {
  document.getElementById("dropmenu").style.display = "none";
}

// If user clicks outside drop down menu, the menu will dissappear
window.addEventListener('mouseup', function(event) {
  var drop = document.getElementById("dropmenu");
  if (event.target != drop) {
      drop.style.display = "none";
  }
})

///////////////////// language //////////////////////////

/** function that open the pop-up screen to change your language preference for the chatbot
 * @param = none.
 * @return = none.
 */
function openLanguage() {
  languageModal.style.display = "block";
  state = !state;
}

// When the user clicks on the x, the languagemodal will close.
languageSpan.onclick = function() {
  languageModal.style.display = "none";
}
// When the user clicks on the help, the helpmodal will close. //
helpSpan.onclick = function() {
  helpModal.style.display = "none";
}
// When the user clicks on the help, the faqmodal will close. //
faqSpan.onclick = function(){
  faqModal.style.display = "none";
}

// When the user clicks anywhere outside of the dropDownMenu, it closes
window.onclick = function(event) {
  if (event.target == languageModal) {
    languageModal.style.display = "none";
  }
  if (event.target == helpModal) {
    helpModal.style.display = "none";
  }
  if(event.target == faqModal){
    faqModal.style.display = "none";
  }
}

// Responses after submitting the language preference in change language option
document.getElementById("changelan").addEventListener("submit", function(value) {
  var val = document.getElementById("langs");
  value.preventDefault();
  document.getElementById("ChangeLanguage").style.display = "none";
  if (languages.includes(val.value)) {
    displayBotMessage(`It is possible to switch to the language ${val.value}.`);
  } else {
    let response = `I cannot speak ${val.value} yet. Do you mind if we chat in English?<br>
                    <button name=LanMenu class="BINARY" onclick="disagreeToDefaultLanguage()"> Yes </button>
                    <button name=LanMenu class="BINARY" onclick="agreeToDefaultLanguage()"> No </button>`;
    displayBotMessage(response);
  }
})

/** function that displays the answer of the bot, in the case that the user cannot speak in English.
 * @param = none.
 * @return = none.
 */
function disagreeToDefaultLanguage() {
  removeElements("LanMenu");
  displayBotMessage("I'm sorry to hear that you don't want to have a chat with me in English and thus sadly I cannot help you.");
}

/** function that displays the answer of the bot, in the case that the user can speak in English
 * @param = none.
 * @return = none.
 */
function agreeToDefaultLanguage() {
  removeElements("LanMenu");
  displayBotMessage("I'm happy to hear that you would still like to chat with me. How can I help you?");
}

///////////////// Help ///////////////////////

/** function that opens the pop-up screen to read the help information
 * @param = none.
 * @return = none.
 */
function openHelpOption() {
  helpModal.style.display = "block";
  state = !state;
}

function openFaqScreen(){
  faqModal.style.display = "block";
  state = !state;
}
