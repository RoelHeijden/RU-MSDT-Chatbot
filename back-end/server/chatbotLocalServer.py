"""
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
"""

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from server.answerData import chatbotAnswerQuestion, answerStorer

"""
Flask server for the chatbot for letting javascript front-end interact with the python back-end
"""


app = Flask(__name__)
CORS(app)  # allow requests from external sources

process = chatbotAnswerQuestion()  # stores and gets answer from chatbot
store_answer_data = answerStorer()  # Stores previous answers from chatbot

@app.route("/")
def default():
    """
    Flask home page, necessary to run local server
    """
    return render_template('index.html')


@app.route("/toPython", methods=['POST'])
def to_python():
    """
    Receiving input from javascript on request by javascript and return the algorithm's answer

    Receives the question input posted to the toPython page and
    inputting this into the neural network and storing this into the process variable

    """
    question = request.get_json()['data']
    print(question)

    process.process(question)

    return process.answer



@app.route('/fromPython', methods=['GET'])
def from_python():
    """
    Sending answer_data to javascript on request by javascript
    """
    print(process.answer)
    return jsonify(process.to_dict())


@app.route('/feedback', methods=['POST'])
def handle_feedback():
    """
    Sends feedback to backend to be stored
    """
    feedback = request.get_json()['data']
    store_answer_data.store(feedback)
    store_answer_data.show()

    return ""

app.run(port=5000)
