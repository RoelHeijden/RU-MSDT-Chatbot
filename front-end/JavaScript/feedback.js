/*
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
*/

// Provides a unique id to the buttons created in askUserFeedback()
var binCount = {
  count: 0,

  // Get function that returns current count
  get getCount() {
    return this.count;
  },

  // Set function that updates the count. Here the parameter "value" represents the
  // Number that needs to be added to the current count.
  set updateCount(value) {
    this.count = this.count + value;
  }
};

// Provides a unique id to the buttons created in askUserTopic()
var tagCount = {
  count: 0,

  get getCount() {
    return this.count;
  },

  set updateCount(value) {
    this.count = this.count + value;
  }
};

// Provides a unique id to the buttons created in askUserQuestion()
var qtnCount = {
  count: 0,

  get getCount() {
    return this.count;
  },

  set updateCount(value) {
    this.count = this.count + value;
  }
};

/** function that sets standard values for messages
 * @param = msg, sender, id and innerHTML.
 * msg represents the actual message that is displayed.
 * sender represents either the Bot or the User, depending on who has send the message.
 * id represents the id of the message.
 * innerHTML represents the HTML code that is used for the message.
 * @return = none.
 */
function setMsgValues(msg, sender, id, innerHTML) {
  msg.className = sender;
  msg.id = id;
  msg.innerHTML = innerHTML;
}

/** function that sets standard values for buttons.
 * @param = btn, className, innerHTML, name and i.
 * btn represents the actual button that is displayed.
 * className represents the class of the button.
 * innerHTML represents the HTML code that is used for the button.
 * name represents the name of the button.
 * i represents the id number of the button.
 * @return = none.
 */
function setBtnValues(btn, className, innerHTML, name, i) {
  btn.className = className;
  btn.innerHTML = innerHTML;
  btn.name = name;
  btn.id = name + '-btn-' + i;
}

////////////////////////// FAQ //////////////////////////////

/** function that checks whether user has another question after FAQ
 * @param = none.
 * @return = none.
 */
function askUserQuestion() {
  var qtnNr = qtnCount.getCount;
  var binary = ["No", "Yes"];

  var questionMsg = document.createElement('div');
  setMsgValues(questionMsg, 'bot-msg', 'question-msg', 'Is there anything else I can help you with?');

  for (var i = 1; i >= 0; i--) {
    var qtnBtn = document.createElement('button');
    setBtnValues(qtnBtn, 'BINARY', binary[i], 'qtn-' + qtnNr, i)

    questionMsg.append(qtnBtn);
  }

  displayBotMessage(questionMsg.innerHTML);
  addQtnBtnEvents(qtnNr);
  qtnCount.updateCount = 1;
}

/** Function that adds buttons to events.
 * @param = qtnNr. qtnNrm represents the number of the question.
 * @return = none.
 */
function addQtnBtnEvents(qtnNr) {
  for (var i = 1; i >= 0; i--) {
    let index = i;
    let qtnBtn = document.getElementById("qtn-" + qtnNr + '-btn-' + index);

    qtnBtn.addEventListener("click", function() {
      askUserQuestionResponse(index);
      removeElements(qtnBtn.name);
    });
  }
}

/** function that translates askUserQuestions() response into messages (after FAQ)
 * @param = choice. Choice represents whether the user has either no more questions or still another question.
 * @return = none.
 */
function askUserQuestionResponse(choice) {
  var answer = ``;
  var response = [``, ``];

  if (choice === 0) {
    answer = `No`;
    response[0] = `I am glad I could be of service to you, ${name}!
            Would you ever have another question, you know where to find me.`;

  }

  if (choice === 1) {
    answer = `Yes`;
    response[0] = `All right ${name}. If you'd like, you can type your question below this time or...`;
    response[1] = `You may also give one of the other questions a try. ${FAQ}`;
  }

  displayUserMessage(answer);
  displayBotMessage(response[0]);
  if (choice == 1){
    displayBotMessage(response[1]);
  }

}

///////////////////////////// question /////////////////////////////////

/** function that checks if the chatbot should ask for feedback.
 * @param = tags. Tags represents either no value, a single value or a list of
 * value, which represents what type of answer is displayed. If one of these tags
 * is in toFilter, then feedback should not be asked, which means false is returned.
 * @return = boolean. Either true, when there needs to be asked for feedback, or
 * false when there does not need to be asked for feedback.
 */
function shouldAskFeedback(tags) {
  const toFilter = ['Greeting', 'Ending'];

  if (typeof(tags) === 'string') {
    return !(toFilter.includes(tags));
  }

  for (var i = 0; i < tags.length; i++) {
    if (toFilter.includes(tags[i])) {
      return false;
    }
  }
  return true;
}

/** function that checks whether the typed answer has been satisfactory for the user.
 * @param = answer_data. answer_data represents all the info the chatbot has about the answer provided.
 * @return = none.
 */
function askUserFeedback(answer_data) {
  if (shouldAskFeedback(answer_data.tags)) {
    var binNr = binCount.getCount;
    var binary = ["No", "Yes"];

    //create the feedback message
    var feedbackMsg = document.createElement('div');
    setMsgValues(feedbackMsg, 'bot-msg', 'feedback-msg', 'Have I answered your question?<br>');

    // create buttons for each option Y/N
    for (var i = 1; i >= 0; i--) {
      var binBtn = document.createElement('button');
      setBtnValues(binBtn, 'BINARY', binary[i], 'bin-' + binNr, i);

      feedbackMsg.append(binBtn);
    }

    displayBotMessage(feedbackMsg.innerHTML);
    addBinBtnEvents(answer_data, binNr);
    binCount.updateCount = 1;
  }
}

/** function that adds eventlisteners for buttons. This must be done after the
 * appendChilds, otherwise onclick's will be reset. It must also be done after
 * message has been display, otherwise it will not recognize id.
 * @param = answer_data, binNr.
 * answer_data represents all the information the chatbot has about the answer provided.
 * binNr represetns the number of the button
 * @return = none.
 */
function addBinBtnEvents(answer_data, binNr) {
  for (var i = 1; i >= 0; i--) {
    let index = i;
    let binBtn = document.getElementById("bin-" + binNr + '-btn-' + index);

    // Adds the event lister for on click
    binBtn.addEventListener("click", function() {
      askUserFeedbackChoice(answer_data, index);
      removeElements(binBtn.name);
    });
  }
}

/** function that stores the binary choice of the user, sends that to the server
 * and then calls the response
 * @param = answer_data and choice.
 * answer_data represents all the info that the chatbot has about the answer provided.
 * choice represent whether there needs to be given any feedback.
 * @return = none.
 */
function askUserFeedbackChoice(answer_data, choice) {
  answer_data['valid'] = choice;
  sendToPython(answer_data, "feedback");
  askUserFeedbackResponse(choice);
}


/** function that translates askUserFeedback() response into messages
 * @param = choice. choice represents whether the user is satisfied or not.
 * @return = none.
 */
function askUserFeedbackResponse(choice) {
  var answer = ``;
  var response = [``, ``, ``];

  if (choice === 0) {
    answer = "No";
    response[0] = `Hmm... I am sorry to hear that ${name}. I may understand your query better if you try to type your question in a different way or...`;
    response[1] = `You can also try one of my pre-selected answers this time. ${FAQ}`;
    response[2] = `If you'd rather ask an employee of the University Library your question, then I would be happy to help you with that.
            <button class="Forward" name="AYLbtn" onclick="askYourLibrarian()"> Forward to librarian </button>`;
  }
  if (choice === 1) {
    answer = "Yes";
    response[0] = `I am happy that I could be of help ${name}!`;
    response[1] = `If you have another question, don't hesitate to ask!`;
  }

  displayUserMessage(answer);
  displayBotMessage(response[0]);
  displayBotMessage(response[1]);
  if (choice === 0) {
    displayBotMessage(response[2]);
  }
}

/////////////////////////// server ////////////////////////////

/** function sets the topic of the question asked.
 * @param = answer_data. anser_data represents the info the Chatbot has about
 * the answer provided.
 * @return = none.
 */
function askUserTopic(answer_data) {
  // Add button for no correct answers
  answer_data.tags.push("None of the above");
  answer_data.response.push(`Sorry, then I don't know the answer to your question, you can ask another question or ask an employee of the Radboud University Library for help:
                    <button class="Forward" name="AYLbtn" onclick="askYourLibrarian()"> Forward to librarian </button>`);

  var tagNr = tagCount.getCount;
  var tags = answer_data.tags;

  //Create element for the bot message
  var topicMsg = document.createElement('div');
  setMsgValues(topicMsg, 'bot-msg', 'topic-msg', answer_data.answer);

  // create buttons for each tag, number of tags can be different.
  for (var i = 0; i < tags.length; i++) {
    topicMsg.innerHTML += `<br>`;

    var tagBtn = document.createElement('button');
    setBtnValues(tagBtn, 'TOPIC', tags[i], 'tag-' + tagNr, i)

    topicMsg.append(tagBtn);
  }

  displayBotMessage(topicMsg.innerHTML);
  addTagBtnEvents(answer_data, tagNr);
  tagCount.updateCount = 1;

}

/** function that eventlisteners for the tag buttons. Add eventlisteners for
 * button click, must be done after the appendChilds, otherwise onclick's will
 * be reset. It must also be done after message has been added to the code,
 * otherwise it will not recognize the id
 * @param = answer_data, tagNr.
 * answer_data represent all the info that the chatbot has about the answer provided.
 * tagNr represent the number of the tag.
 * @return = none.
 */
function addTagBtnEvents(answer_data, tagNr) {
  for (var i = 0; i < answer_data.tags.length; i++) {
    let index = i;
    let tagBtn = document.getElementById("tag-" + tagNr + '-btn-' + index);

    // On click give correct response and delete all buttons from that group
    tagBtn.addEventListener("click", function() {
      askUserTopicResponse(answer_data, index);
      removeElements(tagBtn.name);
    });
  }
}

/** function that translates askUserTopic() response into messages
 * @param = answer_data, index.
 * answer_data represents all the info the chatbot has about the answer provided.
 * index represents the index number of the answer provided.
 * @return = none.
 */
function askUserTopicResponse(answer_data, index) {
  tag = answer_data.tags[index];
  response = answer_data.response[index];

  displayUserMessage(tag);
  displayBotMessage(response);

  // If none of the options where correct, don't handle feedback
  if (tag != "None of the above"){

    // Change data for sending to backend without changing answer_data (answer_data object can be re-used)
    var feedback_data = {...answer_data};
    feedback_data.tags = tag;
    feedback_data.response = response;

    // Ask whether given response is satisfactory
    askUserFeedback(feedback_data);
  }

}
