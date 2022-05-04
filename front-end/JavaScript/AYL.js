/*
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
*/

const aylOptions = {
  SURNAME: 'surname',
  EMAIL: 'email',
  TOPIC: 'topic',
  QUESTION: 'question',
  NAME: 'name'
};

var modal = document.getElementById("TermsOfServices");
var span = document.getElementsByClassName("modal-close")[0];
var binaryBtns = document.getElementsByClassName("BINARY");

var name = "user";
var option = '';
var emailadress = "email";
var surname = "surname";
var category = "category";
var attachment = new Array();
var topic = "topic";
var question = "question";

var regex = /[a-zA-Z0-9]/i;

/** Starts the chain of functions needed to forward a question to the librarian.
  * @param = none.
  * @return = none.
  */
function askYourLibrarian() {
  removeElements("FAQbtn");
  removeElements("AYLbtn");
  displayUserMessage("I would like to forward my question to a librarian.");
  displayBotMessage(`Okay ${name}! Then I need a little bit more extra information from you`);
  ayl = true;
  checkFirstName();
}

/** Selects which step in the process of asking your librarian has to be
  * preformed..
  * @param = none.
  * @return = none.
  */
function askYourLibrarianFunctions() {
  if (!option) {
    throw new Error("<h1 style='color:red'>Option is not there in the above enum</h1")
  }
  switch (option) {
    case aylOptions.SURNAME:
      setSurname();
      break;
    case aylOptions.EMAIL:
      setEmail();
      break;
    case aylOptions.TOPIC:
      setTopic();
      break;
    case aylOptions.QUESTION:
      setNewQuestion();
      break;
    case aylOptions.NAME:
      setFirstName();
      break;
  }
}

////////////////////////// First name ///////////////////////

/** function that checks if first name is correct.
  * @param = none.
  * @return = none.
  */
function checkFirstName() {
  inputBox.disabled = true;
  let response = `Is it correct that your first name is ${name}? <br>
                  <button class="BINARY" name="AYL" onclick="askSurname()"> Yes </button>
                  <button class="BINARY" name="AYL" onclick="repeatFirstName()"> No </button>`;
  displayBotMessage(response);
}

/** function that sets the name of the user.
 *  @param = none.
 *  @return = none.
 */
function setFirstName() {
  if (inputBox.value.match(regex)) {
    name = inputBox.value;
    inputBox.disabled = true;

    let check = `Thank you! Is your first name ${name}? <br>
                 <button class="BINARY" name="AYL" onclick="askSurname()"> Yes </button>
                 <button class="BINARY" name="AYL" onclick="repeatFirstName()"> No </button>`;

    displayUserMessage(name);
    displayBotMessage(check);
    inputBox.value = '';
  }
}

/** function that asks the user to reenter their name.
 * @param = none.
 * @return = none.
 */
function repeatFirstName(){
  removeElements("AYL");
  displayUserMessage("No");
  displayBotMessage("Alright, please enter your first name again.");

  inputBox.disabled = false;
  option = aylOptions.NAME;
}

////////////////////////// Surname ///////////////////////

/** function that asks the user for their surname.
 * @param = none.
 * @return = none.
 */
function askSurname() {
  removeElements("AYL");
  displayUserMessage("Yes");
  displayBotMessage("Great! Next, please type your surname.");

  inputBox.disabled = false;
  option = aylOptions.SURNAME;
}

/** function that sets the surname of the user.
 * @param = none.
 * @return = none.
 */
function setSurname() {
    if (inputBox.value.match(regex)) {
    surname = inputBox.value;
    inputBox.disabled = true;

    let check = `Thank you! Is this your full name: ${name} ${surname}? <br>
                   <button class="BINARY" name="AYL" onclick="askEmail()"> Yes </button>
                   <button class="BINARY" name="AYL" onclick="repeatSurname()"> No </button>`;

   displayUserMessage(surname);
   displayBotMessage(check);
   inputBox.value = '';
  }
}

/** function that asks the user to re-enter their surname.
 * @param = none.
 * @return = none.
 */
function repeatSurname() {
  removeElements("AYL");
  displayUserMessage("No");
  displayBotMessage(`Okay ${name}! Please enter your surname again.`);

  inputBox.disabled = false;
  option = aylOptions.SURNAME;
}

////////////////////////// Email ///////////////////////

/** function that asks for a emailaddress of the user.
 * @param = none.
 * @return = none.
 */
function askEmail() {
  removeElements("AYL");
  displayUserMessage("Yes");
  displayBotMessage("Great! Can you enter your RU emailaddress?");

  inputBox.disabled = false;
  option = aylOptions.EMAIL;
}

/** function that sets the email of the user.
 * @param = none.
 * @return = none.
 */
 function setEmail() {
  // Only accept user input if it follows the conventions of an email address as well as contains .ru.nl
  if (inputBox.value.match(/\S+@\S+\.\S+/) && inputBox.value.includes(".ru.nl")) {
    emailadress = inputBox.value;
    inputBox.disabled = true;

    let check = `Thank you! Is this your email: ${emailadress}?<br>
                   <button class="BINARY" name="AYL" onclick="askCategory(true)"> Yes </button>
                   <button class="BINARY" name="AYL" onclick="repeatEmail()"> No </button>`;

    displayUserMessage(emailadress);
    displayBotMessage(check);
  } else {
    displayBotMessage("Oops, that seems to be an invalid email address. Please enter a valid email address.");
    option = aylOptions.EMAIL;
  }
  inputBox.value = '';
}

/** function that asks the user to re-enter their emailadress.
 * @param = none.
 * @return = none.
 */
function repeatEmail() {
  removeElements("AYL");
  displayUserMessage("No");
  displayBotMessage(`Okay ${name}! Please enter your email again.`);

  inputBox.disabled = false;
  option = aylOptions.EMAIL;
}

////////////////////////// Category ///////////////////////

/** function that asks for the category of the user.
 * @param = value. True when user message 'yes' has to be displayed, false otherwise.
 * @return = none.
 */
function askCategory(value) {
  removeElements("AYL");
  if(value == true){
    displayUserMessage("Yes");
  }
  inputBox.disabled = true;

  let response = `Okay! Are you a student or an employee? <br>
                  <button class="BINARY" name="AYL" onclick="setCategory(true)"> Student RU </button>
                  <button class="BINARY" name="AYL" onclick="setCategory(false)"> Employee RU/RadboudUMC </button>`;

  displayBotMessage(response);
}


/** function that sets the category of the user.
 * @param = value. Either true or false, representing the category of the user.
 * @return = none.
 */
function setCategory(value) {
  removeElements("AYL");

  switch (value) {
    case true:
      category = 'student RU';
      break;
    case false:
      category = 'employee RU/Radboudumc';
      break;
    default:
      informError();
      break;
  }

  let check = `Is this correct? I am a ${category}. <br>
                  <button class="BINARY" name="AYL" onclick="askAttachment()"> Yes </button>
                  <button class="BINARY" name="AYL" onclick="repeatCategory()"> No </button>`;
  displayUserMessage(category);
  displayBotMessage(check);
}

/** function that prompts the user to re-select their category.
 * @param = none.
 * @return = none.
 */
function repeatCategory() {
  removeElements("AYL");
  displayUserMessage("No");

  inputBox.disabled = false;
  ayl = true;
  option = askCategory(false);
}

////////////////////////// Attachment ///////////////////////

/** function that asks the user if they want to add an attachment.
 * @param = none.
 * @return = none.
 */
function askAttachment() {
  removeElements("AYL");
  displayUserMessage("Yes");
  inputBox.disabled = true;

  displayAtmButton();
  checkAttachment();
}

/** function that lets user indicate when they are done with adding files.
 * @param = none.
 * @return = none.
 */
 function checkAttachment() {
  let check = `Press the button below when you are done.
                <input type="submit" class="BINARY" name="AYL" id="submit-btn" value="Done" onclick="setAttachment()"> </input>`
  displayBotMessage(check);
}

/** function that retrieves the chosen files from attachment.js
 * @param = none.
 * @return = none.
 */
function setAttachment() {
  removeElements("AYL");
  removeAtmBtn();

  attachment = getFiles();
  var fileList = getFileList(attachment);
  var userMsg = '';

  if (attachment.length === 1) {
    userMsg = 'attached ' + attachment.length + ' file';
  }
  else if (attachment.length > 1) {
    userMsg = 'attached ' + attachment.length + ' files:';
  }

  displayUserMessage(`Done, ${userMsg} ${fileList}`);
  askTopic();
}

////////////////////////// Topic ///////////////////////

/** function that asks the user for the topic of the question.
 * @param = none.
 * @return = none.
 */
function askTopic() {
  displayBotMessage("Amazing! Can you enter the topic of the question?");

  inputBox.disabled = false;
  option = aylOptions.TOPIC;
}

/** function that sets the topic of the question.
 * @param = none.
 * @return = none.
 */
function setTopic() {
  removeElements("AYL");
  if (inputBox.value.match(regex)) {
    topic = inputBox.value;
    inputBox.disabled = true;

    let check = `Thank you! Is this the correct topic: ${topic}? <br>
                 <button class="BINARY" name="AYL" onclick="checkQuestion()"> Yes </button>
                 <button class="BINARY" name="AYL" onclick="repeatTopic()"> No </button>`;

    displayUserMessage(topic);
    displayBotMessage(check);
    inputBox.value = '';
  }
}

/** function that asks the user to re-enter the topic of their question.
 * @param = none.
 * @return = none.
 */
function repeatTopic() {
  removeElements("AYL");
  displayUserMessage("No");
  displayBotMessage(`Okay ${name}! Please type in the correct topic.`);

  inputBox.disabled = false;
  option = aylOptions.TOPIC;
}

////////////////////////// Question ///////////////////////

/** function that checks whether the given question is right.
 * @param = none.
 * @return = none.
 */
function checkQuestion() {
  removeElements("AYL");
  displayUserMessage("Yes");
  inputBox.disabled = true;

  let check = ` Super! Just to be sure, is this the question you wanted to ask: ${question}? <br>
                  <button class="BINARY" name="AYL" onclick="giveConsent()"> Yes </button>
                  <button class="BINARY" name="AYL" onclick="repeatQuestion()"> No </button>`;
  displayBotMessage(check);
}

/**  function that asks the user to re-enter their question.
 * @param = none.
 * @return = none.
 */
function repeatQuestion() {
  removeElements("AYL");
  displayUserMessage("No");
  displayBotMessage(`Okay ${name}! Please retype your question. `);

  inputBox.disabled = false;
  option = aylOptions.QUESTION;
}

/** function that sets the question of the user.
 * @param = q. Q represents the question of the user.
 * @return = none.
 */
function setQuestion(q) {
  question = q;
}

/** function that sets the new question of the user.
 * @param = none.
 * @return = none.
 */
function setNewQuestion() {
  if (inputBox.value.match(regex)) {
    question = inputBox.value;
    inputBox.disabled = true;

    let check = `Thank you! Is this your question: ${question}? <br>
             <button class="BINARY" name="AYL" onclick="giveConsent()"> Yes </button>
             <button class="BINARY" name="AYL" onclick="repeatQuestion()"> No </button>`;

    displayUserMessage(question);
    displayBotMessage(check);
    inputBox.value = '';
  }
}

////////////////////////// Consent ///////////////////////

/** function that let the user give consent.
 * @param = none.
 * @return = none.
 */
function giveConsent() {
  removeElements("AYL");
  displayUserMessage("Yes");
  inputBox.disabled = true;

   let botMsg = `Great! Now I know everything to forward the message. Accept the terms of Service to send the e-mail. </span> <br>
                 <input type="checkbox" id="accept" onclick="termsChanged(${this})"> I agree to the
                 <button class="attach-lbl" id="popUpBtn" onclick=openPopup()>Terms of Service</button>
                 <input type="button" value="Send Email" onclick="ready()">`
  displayBotMessage(botMsg);
}

/** function that sends the signal to the sendEmail function.
 * @param = none.
 * @return = none.
 */
function ready() {
  inputBox.disabled = false;
  sendEmail();
}

// When the user clicks on the x button of the Terms of Service pop-up, closes the pop-up.
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the Terms of Service pop-up, closes the pop-up.
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

/** function that displays the Terms of Service pop-up.
 * @param = none.
 * @return = none.
 */
function openPopup() {
  modal.style.display = "block";
}

/** function that enables the submit button when the checkbox has been checked for Terms of Services
 * @param = checkbox, which represents the object of the checkbox.
 * @return = none.
 */
function termsChanged(checkBox) {
  if (checkBox.checked) {
    document.getElementById("submitTerms").disabled = false;
  } else {
    document.getElementById("submitTerms").disabled = true;
  }
}
