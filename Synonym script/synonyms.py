""" 
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree. 
"""

from tkinter import Tk, filedialog
from nltk.corpus import wordnet
from textblob import TextBlob
import pandas as pd
import numpy as np

correct_data = []


def main():
    """
    Runs the script.
    """
    root = Tk()
    root.withdraw()
    root.filename = filedialog.askopenfilename(initialdir="/", title="Select file",
                                               filetypes=(("Excel files", "*.xlsx"),))
    if root.filename:
        dataframe = pd.read_excel(root.filename, engine='openpyxl')
        input_data = dataframe['Input']
        output_data = dataframe['Output']
        tag_data = dataframe['Tag']
        index = 0
        global correct_data
        correct_data = dataframe
        for sentence in input_data:
            text = sentence.split()
            nouns = []
            for word in text:
                text = TextBlob(word)
                if text.tags == [(text, 'NN')] or text.tags == [(text, 'NNP')]:
                    nouns.append(word)
            for noun in nouns:
                synonyms = check_synonyms(noun)
                for syn in synonyms:
                    new_sentence = sentence.replace(noun, syn)
                    correct_data = correct_data.append({"Input": new_sentence, "Output": output_data[index],
                                                        "Tag": tag_data[index]}, ignore_index=True)
            index = index + 1
        correct_data.to_excel(root.filename[:-5] + "_syn.xlsx", index=False)
        input("The file is now written with synonyms! Press enter to close the program")
    else:
        print("You did not chose the right file. Please select another file.")
        main()


def check_synonyms(noun):
    """
    Checks for synonyms for the given word.
        :param noun: String
        :return: synonyms: List
    """
    synonyms = []
    for syn in wordnet.synsets(noun):
        for lm in syn.lemmas():
            synonyms.append(lm.name())
    synonyms = np.unique(synonyms)
    return synonyms


if __name__ == '__main__':
    print("Lets do this!")
    main()
