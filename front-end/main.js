/*
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
*/

const serverUrl = 'http://127.0.0.1:5000'; //'http://URL_OF_SERVER_MUST_GO_HERE.com';
const chatFlow = document.querySelector('.chat-flow');
const inputBox = document.querySelector('.input-box');
const sendBtn = document.querySelector('.send-button');
const startBtn = document.querySelector('.start-chat-button');
const inputNme = document.querySelector('.name-box');

var ayl = false;
var i = 0;
var errorNotificationSent = false;

/** function that shows chat-window when click on chat-button
 * @param = none.
 * @return = none.
 */
function showChat() {
  document.getElementById("chatWdw").style.display = "flex";
  document.getElementById("chatBtn").style.display = "none";
}

/** function that hides chat-window when click on close-button
 * @param = none.
 * @return = none.
 */
function hideChat() {
  document.getElementById("chatWdw").style.display = "none";
  document.getElementById("chatBtn").style.display = "block";
}

/** function that reset and end chat when click on reset button
 * @param = none.
 * @return = none.
 */
function resetChat() {
  var response = confirm("Are you sure you want to end this chat? All information will be cleared.");
  if (response) {
    hideChat();
    document.getElementById("nameScrn").style.display = "block";
    document.getElementById("chatFlw").style.display = "none";
    document.getElementById("chatInpt").style.display = "none";
    removeElements("msg");
    ayl = false;
  }
}

/** function that also resets the chat, but without going back to the name screen.
 * @param = none.
 * @return = none.
 */
function alternateResetChat() {
  hideChat();
  deleteElements("msg");
  ayl = false;
  welcomeMessage();
}

/** function that sets the name of the user
 * @param = none.
 * @return = none.
 */
function enterName() {
  name = inputNme.value;
  inputNme.value = '';
}

/** function that starts the chat when clicked on start-chat-button.
 * @param = none.
 * @return = none.
 */
function startChat() {
  if (inputNme.value != "") {
    document.getElementById("nameScrn").style.display = "none";
    document.getElementById("chatFlw").style.display = "block";
    document.getElementById("chatInpt").style.display = "flex";
    document.getElementById("ddm").style.display = "inline-block";
    enterName();
    welcomeMessage();
  }
}

// Start chat when enter is hit in the namebox
inputNme.addEventListener('keydown', (ev) => {
  var key = ev.keyCode
  var allowed_keys = [8, 16, 32, 54, 109, 173, 189, 222]

  // Only start chat if enter is hit and name includes a lowercase character
  if (ev.keyCode === 13 && inputNme.value.match(/[a-z]/i)) {
    startChat();
  }

  // If key is not in alphabet, or is not another allowed key, ignore
  else if (!(key >= 65 && key <= 90) && !allowed_keys.includes(key)) {
    ev.preventDefault();
  }
})

// Send message in input-box when click on send-button
sendBtn.addEventListener('click', () => {
  switch (ayl) {
    case false:
      sendMessage();
      break;
    case true:
      askYourLibrarianFunctions();
      break;
  }
})

// Send message in input-box when enter is hit
inputBox.addEventListener('keyup', (ev) => {
  // Prevents empty messages and allows enter for keypress shift+enter
  if (ev.keyCode === 13 && !ev.shiftKey && ayl === false) {
    sendMessage();
  } else if (ev.keyCode === 13 && ayl === true) {
    askYourLibrarianFunctions();
  }
})

/** function that deletes all elements that have the given name
 * @param = name. name represents the name of the element.
 * @return = none.
 */
function removeElements(name) {
  var elements = document.getElementsByName(name);

  //Keep deleting the root node until empty
  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}
