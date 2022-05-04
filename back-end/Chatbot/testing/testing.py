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
import pandas as pd


class Testing:
    """
    Main class for testing a trained neural network.
    """

    def __init__(self, filename):
        """
        :param output_settings: List
            Settings of the output class

        :param filename: String
            Name of file of network parameters

        :param path: String
            Absolute path to the file
        """

        self.parent_path = df.get_par_dir(__file__)
        self.path = self.parent_path + "\\" + filename


    def chat(self):
        """
        Test the trained model via simulated chat in the console.

        'a' ends the chat.

        :return: None
        """

        file = File(self.path)
        output = Output(file)
        print("Starting chat - enter 'a' to quit")
        while True:
            sentence = input("You: ")
            if sentence == 'a':
                print("aborted", end="\n\n")
                break

            print("Sam:", end=" ")
            answer, probs = output.respond(sentence)
            print(answer[0])
            print(answer[1])
            print('\033[34m' + probs + '\033[0m')

    def quick_test(self):
        """
        Runs the algorithm on multiple test questions contained in test_questions.csv and prints the accuracy.

        :return: None
        """

        print("Starting quick test")
        questions = pd.read_csv(self.parent_path + "\\" + "Data\\test_questions.csv")
        file = File(self.path)
        output = Output(file)

        probs = []
        correct = 0
        for i in range(len(questions)):
            tag = questions['tag'][i]
            sentence = questions['sentence'][i]
            prob, pred = output.get_prob(sentence, tag)

            probs.append(prob.detach().numpy())
            if prob > output.respond_threshold:
                correct += 1

            print(f"{i + 1}. \033[34m{prob:.3f} {tag}\033[0m", end="")
            print(f"  predicted: {pred}")

        print(f"Correct: {correct}/{len(questions)}")
        avg = sum(probs)/len(questions)
        print(f"Average: {avg:.4f}")
        print()

