""" 
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree. 
"""

from Chatbot.Algorithm.output import Output
from Chatbot.DataProcessing.importExport import File
from utils import directoryFinder as df


class Run:
    """
    Class for the server to run.

    The server communicates with the algorithm through this class.
    """
    def __init__(self, file="Data\\data.pth"):
        """
        :param file: String
            Location of the nn model file
        """

        self.save_file = file
        data_location = df.get_cur_dir(__file__)
        self.path = data_location + "\\" + self.save_file
        self.file = File(self.path)
        self.output = Output(self.file)


    def get_answer(self, sentence):
        """
        Gets the bot's response.

        :param sentence: string
            input sentence
        :return: tuple of Strings
            answer, tag and response
        """
        answer, _ = self.output.respond(sentence)
        return answer
