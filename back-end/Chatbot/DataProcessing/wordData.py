""" 
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree. 
"""

import pandas as pd


class WordData:
    """
    Class to init and store the word data.

    Reads the csv file with training data, stores the data and prepares the data for further processing.
    """

    def __init__(self, filename, nlp):
        """
        :param filename: String
            Path to .csv file

        :param raw_data:  List
            List of dicts containing "patterns", "responses" and "tags".

        :param all_words: List
            List of all unique pattern words

        :param tags: List
            List of all unique tags

        :param xy: tuple ([words], tag)
            Tuples containing ([words], tag) for each pattern
        """

        self.nlp = nlp
        self.csv = pd.read_csv(filename)
        self.raw_data = self.convert(self.csv)
        self.all_words, self.tags, self.xy = self.init_words()


    def details(self):
        """
        Prints details of the data to the console.

        :return: None
        """
        print("Dataset:")
        print(" unique words:", len(self.all_words))
        print(" samples:", len(self.xy))
        print(" tags:", len(self.tags))
        print()

    def show(self):
        """
        Prints the data to the console.

        :return: None
        """
        for dic in self.raw_data:
            print("tag:", dic['tag'])
            print("patterns:")
            for pat in dic['patterns']:
                print("  ", pat)
            print("response:", dic['response'])
            print()

    def convert(self, csv):
        """
        Converts a pandas file to a structured dictionary.

        :param csv: pandas dataframe
            trainingdata.csv file
        :return: list of dicts containing "patterns", "responses" and "tags"
        """

        raw_data = []
        seen_tags = []
        for i in range(len(csv)):
            tag = csv['Tag'][i]
            pattern = csv['Input'][i]
            output = csv['Output'][i]

            if tag not in seen_tags:
                seen_tags.append(tag)
                dic = {
                    'tag': tag,
                    'patterns': [pattern],
                    'response': output}
                raw_data.append(dic)
            else:
                for dic in raw_data:
                    if dic['tag'] == tag:
                        dic['patterns'].append(pattern)
        return raw_data


    def init_words(self):
        """
        Initializes the word data.

        Reads the raw data, tokenizes and stems the words using the NLP class.
        It then forms ngrams of size n_gram_size (initialized in main.py).

        :return:
            all_words: list of all unique pattern words
            tags:      list of all unique tags
            xy:        tuples containing ([words], tag) for each pattern
        """

        all_words = []
        tags = []
        xy = []

        for i, chat in enumerate(self.raw_data):
            tag = chat['tag']
            tags.append(tag)

            for pattern in chat['patterns']:
                # tokenize, filter and stem the sentences
                words = self.nlp.tokenize(pattern)
                words = [self.nlp.stem(w) for w in words]

                ngrams = self.nlp.to_ngrams(words)
                all_words.extend(ngrams)

                # spell corrects to counteract stemming mistakes
                words_corrected = [self.nlp.spell.correction(w) for w in words]
                ngrams_corrected = self.nlp.to_ngrams(words_corrected)

                xy.append((ngrams_corrected, tag))

            print("Words from tag", i+1, "processed")
        print()
        all_words = sorted(set(all_words))
        tags = sorted(set(tags))
        return all_words, tags, xy
