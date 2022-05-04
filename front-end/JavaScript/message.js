/*
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
*/

/** function that displays welcome chatbot message
 * @param = none.
 * @return = none.
 */
function welcomeMessage() {
  displayBotMessage(`Greetings ${name}! Let me know what I can help you with today by typing in
                  your question below or click on one of our preselected questions. ${FAQ}`);
}

/** function that displays the message when user enters "help"
 * @param = none.
 * @return = none.
 */
function helpMessage() {
  displayBotMessage(`If you have a question, you can type it in or select one from the FAQ.
                   Next to my name, there is a menu depicted by three dots which contains options
                  like change converse language or display frequently asked questions.`);
  displayBotMessage(`For more information, you can select "Help" in the menu mentioned or click
                  <button class="attach-lbl" id="helpMenu" onclick=openHelpOption()>here</button>.`);
}

/** function that displays the error message.
 * @param = none.
 * @return = none.
 */
function errorMessage() {
  displayBotMessage("Sorry, the chatbot is unable to respond");
  displayBotMessage(`You can try again, or ask an employee of the Radboud University Library for help:
                    <button class="Forward" name="AYLbtn" onclick="askYourLibrarian()"> Forward to librarian </button>`);
}


/** funtion that displays bot messages.
 * @param = message. message represents the bot message.
 * @return = none.
 */
function displayBotMessage(message) {
  var formatted = urlify(message);
  let botMessage = `<div class="bot-msg" name="msg">
                    <span> ${formatted} </span>
                    </div>`;
  displayMessage(botMessage);
}

/** function that displays user messages.
 * @param = message. message represents the user message.
 * @return = none.
 */
function displayUserMessage(message) {
  let userMessage = `<div class="user-msg" name="msg">
                    <span> ${message} </span>
                    </div>`;
  displayMessage(userMessage);
}

/** function to send a message
 * @param = none.
 * @return = none.
 */
function sendMessage(){
  var userInput = inputBox.value;
  inputBox.value = '';

  // Gives short summary of options in chatbot if the user types help
  if (userInput.match(/^help/i) && userInput.split(" ").length < 3) {
    helpMessage();
  }
  // Only accept user input if it contains a digit or lowercase character
  else if (userInput.match(/[a-z0-9]/i)){

    setQuestion(userInput);
    displayUserMessage(userInput);
    messageWithServer(userInput);
  }
}

/** function that displays a message.
 * @param = message. message represents either the bot or user message.
 * @return = none.
 */
function displayMessage(message){
  chatFlow.insertAdjacentHTML("beforeend", message);
  messageCollection = document.getElementsByName("msg");
  message = messageCollection[messageCollection.length-1];
  message.scrollIntoView();
}

/** function that sends the javascript to the python files.
 *  @param = userInput. userInput represents the user input.
 *  @return = none.
 */
function messageWithServer(userInput){
  displayThinkingImg();
  toPythonAndBack(userInput)

    // wait till answer is received before sending it to the user
  .then(function(answer_data) {
    removeThinkingImg();
    displayServerAnswer(answer_data);
  });
}

/** function that displays bot-msg retrieved from server
 * @param = answer_data. answer_data represents all info the chatbot has about
 * the answer provided.
 * @return = none.
 */
function displayServerAnswer(answer_data){
  const answer = answer_data.answer;
  const type = answer_data.response_type;

  // Chatbot isn't certain of any response
  if (type === "none"){
    displayBotMessage(answer);
  }
  // One answer returned by chatbot
  else if (type === "single"){
    displayBotMessage(answer);
    askUserFeedback(answer_data);
  }
  // List of answers returned
  else if (type === "multiple"){
    askUserTopic(answer_data);
  }
  // In all other cases display an error
  else {
    errorMessage();
  }
}

/** function that makes an HTML object from an url in text input
 * @param = text. text represents the text that contains a url.
 * @return = text with the url being replaced with the HTML object.
 */
function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return '<a href="' + url + '" target="_blank">' + 'link' + '</a>';
  })
}

/** function that displays the loader.gif
 * @param = none.
 * @return = none.
 */
function displayThinkingImg(){
  let thinkingImg = `<div class="bot-thinking" name= "thinkingImg">
                       <img src= "img/loader.gif" alt= "The chatbot is thinking" width=10% height=10%>
                     </div>`;

  displayMessage(thinkingImg);
}

/** function that removes the oldest loader.gif
 * @param = none.
 * @return = none.
 */
function removeThinkingImg(){
  thinkingImg = document.getElementsByName("thinkingImg")[0];
  thinkingImg.remove();
}
