""" 
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree. 
"""

import numpy as np
from torch.utils.data import Dataset

class TrainingData(Dataset):
    """
    Class to init and store the binary dataset matrix, extends Dataset.
    """

    def __init__(self, data, nlp):
        """
        :param data: worddata class
            Data class containing all_words, tags and xy

        :param X: List
            data matrix

        :param y: List
            label array
        """

        self.nlp = nlp
        self.X, self.y = self.init_data(data)
        self.n_samples = len(self.y)
        self.n_tags = len(data.tags)

    def __getitem__(self, i):
        return self.X[i], self.y[i]

    def __len__(self):
        return self.n_samples


    def init_data(self, data):
        """
        Converts the word data to a binary matrix

        :param data: worddata class
            Data class containing all_words, tags and xy
        :return:
            X: word occurance matrix {0, 1}
            y: tag array {0, 1, ...}
        """

        x_dim = len(data.xy)
        y_dim = len(data.all_words)

        X = np.zeros(shape=(x_dim, y_dim))
        y = np.zeros(x_dim)

        for i in range(x_dim):
            ngrams, tag = data.xy[i]
            y[i] = data.tags.index(tag)

            for input_gram in ngrams:
                # get synonyms
                syn_gram = self.nlp.get_syn_gram(input_gram)
                # checks if input synonyms match any of the known ngrams
                for j, ngram in enumerate(data.all_words):
                    if self.nlp.ngrams_match(syn_gram, ngram):
                        X[i][j] = 1

            if i % 20 == 0:
                print(i+20, "patterns converted")
        print()
        return X, y

