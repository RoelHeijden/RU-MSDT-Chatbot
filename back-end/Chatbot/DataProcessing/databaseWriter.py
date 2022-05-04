""" 
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree. 
"""

import csv
import os
from utils import directoryFinder as df


class DatabaseWriter:
    """
    Class for writing/storing new training data.

    Writes answer data to csv with the columns: question, answer, tag, valid.
    In the columns the answer data for each question answer combination is stored.
    When the file does not exist, it creates a new file.
    """

    def __init__(self, filename="Data\\nn_feedback_data.csv"):
        """
        :param filename: String
            Name of file to store answer data in
        :param path: String
            Absolute path to the csv file
        """

        data_location = df.get_par_dir(__file__)
        self.path = data_location + "\\" + filename

    def write_to_database(self, question, answer, tag, valid):
        """
        Takes the question, answer and tag of a user question and writes it to database.csv.

        :param question: String
            The question from the user
        :param answer: String
            The answer from the chatbot
        :param tag: String
            The tag associated with that answer
        :param valid: Int
            1 if user clicked yes when asked if satisfied with answer, 0 if no was clicked
        :return: None
        """

        if not os.path.isfile(self.path):
            self.create_database()
        self.write_row(question, answer, tag, valid)

    def create_database(self):
        """
        Creates a new csv with the columns question, answer, tag, valid.

        :return: None
        """

        database = open(self.path, 'a+')
        csv_writer = csv.writer(database)
        csv_writer.writerow(["Question", "Answer", "Tag", "Valid"])
        database.close()

    def write_row(self, question, answer, tag, valid):
        """
        Adds a new row with the parameters below in their correspondingly named category.

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
            Tags connected to the responses
        :return: None
        """

        database = open(self.path, 'a+')
        csv_writer = csv.writer(database)
        csv_writer.writerow([question, answer, tag, valid])
        database.close()

    def write_rows(self, rows):
        """
        Writes all rows in parameter rows to the csv.

        :param rows: List
            List of rows with each row a tuple of question, answer, tag, valid.
        :return: None
        """
        [self.write_row(question, answer, tag, valid) for question, answer, tag, valid in rows]

