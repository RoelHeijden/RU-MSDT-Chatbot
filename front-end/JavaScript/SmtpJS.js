/*
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
*/


const sender = ""
const password = ""
const ub_error_mailaddress = ""

/** function that sends an email.
 * @param = question, emailaddress.
 * question represents the question of the user.
 * emailadress represents the emailadress of the user.
 * @return = none.
 */
function sendEmail(){
  Email.send({
    Host: "",
    Username: "",
    Password: password,
    To: "",
    From: sender,
    Subject: "",
    Body: question
  }).then(
    message => alert(message)
  );
}

/** function that sends an confirmation email.
 * @param = emailadress. emailadress represents the emailadress of the user.
 * @return = none.
 */
function sendConfirmation(emailaddress){
  Email.send({
      Host : "",
      Username : sender,
      Password : password,
      To : emailaddress,
      From : sender,
      Subject : "Confirmation email UBN chatbot",
      Body : "We have received your question and we will answer your question as soon as possible."
  }).then(
    message => alert(message)
  );
}

/** function that sends an error notification.
 * @param = none.
 * @return = none.
 */
function sendErrorNotification(){
  Email.send({
      Host : "",
      Username : sender,
      Password : password,
      To : ub_error_mailaddress,
      From : sender,
      Subject : "Error message UBN chatbot",
      Body : "There is a technical problem with the chatbot."
  }).then(
    message => alert(message)
  );
}

/** function that informs the user that their question has been forwarded to a librarian.
 * @param = none.
 * @return = none.
 */
function informForwarded() {
  displayBotMessage("I forwarded the email with your question to my colleagues at the University Library! They will try to answer your question within one working day.");
}

/** function that informs the user that a confirmation email has been send to their emailadress.
 * @param = none.
 * @return = none.
 */
function informConfirmation() {
  displayBotMessage("I sent a confirmation email to your given emailaddress. At this emailaddress, you will receive your answer.");
  ayl = false;
}

/** function that informs the user that the chatbot isn't working and an email has been send.
 * @param = none.
 * @return = none.
 */
function informError() {
  displayBotMessage(" I am sorry, but I am having some technical problems. My colleagues have been send an update and will help me fix it.");
}
