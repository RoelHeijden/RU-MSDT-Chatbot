/*
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
*/

// The buttons for the three most frequently asked questions
var FAQ = `<button class="FAQ" name="FAQbtn" onclick="FAQResponse(1)"> What are the opening hours of the Central Library? </button>
           <button class="FAQ" name="FAQbtn" onclick="FAQResponse(2)"> I'm looking for a book/journal, what should I do? </button>
           <button class="FAQ" name="FAQbtn" onclick="FAQResponse(3)"> Where can I book a study workspace? </button>`;

// Separate questions and repsonses for the three FAQs
var FAQ1_question = `What are the opening hours of the Central Library?`;
var FAQ1_response = `The Central Library is open on weekdays from 08:30 AM till 6:00 PM.
                     <BR> On saturdays and sundays the Central Library is open from 10:00 AM till 6:00 PM.
                     <BR> If you want to know more about the Central Library, click on this
                        https://www.ru.nl/library/library/library-locations/central-library/choice/locations-central-library/`;

var FAQ2_question = `I'm looking for a book/journal, what should I do?`;
var FAQ2_response = `To find a book/journal you can make use of
                      https://ru.on.worldcat.org/discovery?lang=en
                     which is the online database used by the Radboud University for study materials.
                     <BR> If you want more information about how to use RU Quest, you can find the helpguide using this
                        https://libguides.ru.nl/ruquestEN`;

var FAQ3_question = `Where can I book a study workspace?`;
var FAQ3_response = `If you are a student of the Radboud University, you can book a workspace directly using this
                      https://face.ru.nl/
                     <BR> If you are not, or you want more information about rules for reserving a workspace, you can use this
                        https://www.ru.nl/library/services/study/reservation-study/`;

/** function that displays the FAQ buttons.
 * @param = none.
 * @return = none.
 */
function displayFAQ() {
  displayBotMsg(`Here are the Frequently Asked Questions: ${FAQ}`);
  state = !state;
}

/** function that displays the question and answers to the clicked FAQ question.
 * @param = index. Index indicates which FAQ is clicked by the user.
 * here index 1 represents the first FAQ etc.
 * @return = none.
 */
function FAQResponse(index) {
  var question = ``;
  var answer = ``;

  if (index === 1) {
    question = FAQ1_question;
    answer = FAQ1_response;
  }
  else if (index === 2) {
    question = FAQ2_question;
    answer = FAQ2_response;
  }
  else if (index === 3) {
    question = FAQ3_question;
    answer = FAQ3_response;
  }

  removeElements("FAQbtn")
  removeElements("AYLbtn");

  displayUserMessage(question);
  displayBotMessage(answer);
  askUserQuestion();
}
