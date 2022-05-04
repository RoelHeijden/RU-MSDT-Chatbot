"""
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
"""

from Chatbot.runServer import Run
from Chatbot.DataProcessing.databaseWriter import DatabaseWriter

class chatbotAnswerQuestion:
    """
    Processes a question and sets values to be returned to the front-end

    When a question is input into process, the question is but into the correct
    format for the neural network. The nn is run and then the answer_data for use
    in the front-end is stored in the parameters.

    """

    def __init__(self):
        """
        :param question: String
            What the user asked
        :param answer: String
            What the chatbot answered
        :param response_type: String
            Type of response based on what the chatbot returned possible values:
                    "none" = Chatbot isn't certain of any response
                    "single" = One answer returned by chatbot
                    "multiple" = list of answered returned
        :param response: None/String/List
            All possible responses, None if response_type="none", Single string if response_type="single",
            list of strings if response_type="multiple"
        :param tags: None/String/List
            tags connected to the responses
        :param nn: NeuralNet
            Chatbot neural network
        """

        self.question = ""
        self.answer = None
        self.response_type = "none"
        self.response = None
        self.tags = None

        self.nn = Run()

    def process(self, question):
        """
        Process question formatting, input to neural network and set class parameters

        :param question: String
            Question for input into Neural network
        """
        # remove \n if present
        if len(question) >= 2 and question[-1:] == "\n":
            question = question[:-1]

        self.question = question
        answer, tags, response = self.nn.get_answer(question)
        self.answer = answer
        self.response_type = self.get_response_type(response)
        self.tags = tags
        self.response = response


    def get_response_type(self, response):
        """
        Returns type of the response

        :param response: None/String/List
            All possible responses, None if response_type="none", Single string if response_type="single",
            list of strings if response_type="multiple"
        """
        if response is None:
            return "none"
        if isinstance(response, list):
            return "multiple"
        return "single"


    def to_dict(self):
        """
        :return: dictionary made of all parameters stored in the class
        """
        return {"question": self.question, "answer": self.answer, "response_type": self.response_type, "response": self.response, "tags":self.tags}



class answerStorer:
    """
    Stores data from an answer in dictionaries, writes the answers to a file

    The combination of the user question the chatbot answer, the tag
    and whether the answer was deemed correct by the user is written to nn_feedback_data.csv
    and stored in a dictionary.
    """

    def __init__(self):
        """

        :param questions:
            List of user questions
        :param tags:
            List of tags corresponding to the user question
        :param responses:
            List of responses corresponding to the user question
        :param valid:
            Are the tag and response a correct answer to the question list of 0(=correct) and 1(=incorrect)
        """

        self.questions = []
        self.tags = {}
        self.responses = {}
        self.valid = {}

        self.dw = DatabaseWriter()

    def store(self, answer_data):
        """
        Stores info from answer_data in dictionary for this session
        Writes {question, tags, response, valid} to excel file

        :param answer_data: a dictionary containing: {question, answer, response_type, response, tag}
        """

        question = answer_data.get("question")

        self.questions.append(question)
        self.tags[question] = answer_data.get("tags")
        self.responses[question] = answer_data.get("response")
        self.valid[question] = answer_data.get("valid")

        self.dw.write_to_database(question, self.responses[question], self.tags[question], self.valid[question])

    def write_all_to_database(self):
        """
        Writes all stored answer data to an excel file
        """

        for i in range(len(self.questions)):
            question = self.questions[i]
            tag = self.tags.get(question)
            response = self.responses.get(question)
            valid = self.valid.get(question)

            self.dw.write_to_database(question, response, tag, valid)

    def show(self):
        """
        Prints all answer_data of the current session to the console
        """

        for q in self.questions:
            print("question: ", q)
            print("tag: ", self.tags.get(q))
            print("response: ", self.responses.get(q))
            print("valid: ", self.valid.get(q))
            print("\n")


