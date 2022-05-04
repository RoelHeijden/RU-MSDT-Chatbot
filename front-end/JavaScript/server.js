/*
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree. 
*/

/** function that requests the server to send an answer.
 * @param = userInput. userInput represents the user input.
 * @return = getFromPython(). getFromPython() is a function that retrieves the
 * answer from Python.
 */
 function toPythonAndBack(userInput){
  return sendToPython(userInput)
  .then(() => { return getFromPython(); });

}


/** function that retrieves an answer from Pythom.
 * @param = page. page represents the location where the question gets send to
 * @return = the parsed response.
 */
function getFromPython(page='fromPython'){
    return fetch(serverUrl + '/' + page)
        .then(handleRequestError)

        .then(function (response) {
            return response.json(); // Parse resonse as JSON
        })
        .catch(catchServerError);
}

/** function that sends the user input to Python.
 * @param = question, page.
 * question represents the question that the user asked to the chatbot.
 * page represents location where the question gets send to.
 * @return = the place where the javascript has send been send to.
 */
function sendToPython(question, page='toPython') {
    return fetch(serverUrl + '/' + page, {
      // The type of data we're sending
      headers: {'Content-Type': 'application/json' },
      // Method of sending
      method: 'POST',
      // What we are sending
      body: JSON.stringify({"data" : question})
      })
      .then(handleRequestError)
      .catch(catchServerError);
}

/** function that handles the error request
 * @param = response. response represents the response message.
 * @return = response. response represents the response message.
 */
function handleRequestError(response) {
    if (response.ok) {
      return response
    }
    throw Error(response.statusText);
}

/** function that catches server errors.
 * @param = error. error represents the error message.
 * @return = string containing the messages that needs to be displayed.
 */
function catchServerError(error) {
    console.error(error);
    console.error("server might be inactive");
    return "There was an error while trying to reach the backend";
}
