""" 
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree. 
"""

import torch
import numpy as np
from Chatbot.DataProcessing.nlp import NLP


class Output:
    """
    Class for getting the correct output response.

    Finds the correct response by:
    - Activating the NN
    - Matching the tags based on the output probabilities
    """

    def __init__(self, file):
        """
        :param file: .pth file
            File containing the NN model, data and class settings:

                model: Torch model state
                    Trained NN weights

                raw_data: Dictionary
                    All training patterns, tags and responses

                all_words: List
                    All unique words from the training data

                tags: List
                    All unique tags

                nlp_settings: List
                    NlP class settings matching the model

                output_settings: List
                    Output class settings matching the model
        """

        self.model, self.raw_data, self.all_words, self.tags, nlp_settings, output_settings = file.load()

        self.respond_threshold = output_settings[0]
        self.guess_threshold = output_settings[1]
        self.gap_ratio_threshold = output_settings[2]
        self.max_guesses = output_settings[3]
        self.filtered_tags = output_settings[4]

        self.nlp = NLP(nlp_settings)
        self.model.eval()


    def respond(self, sentence):
        """
        Finds the correct response matching the tags.

        :param sentence: String
            Multiple words in a logical sequence
        :param pred_tags: None, tag or list of tags
            Predicted tags
        :return:
            answer: String
            tags: None/String/List
            responses: None/String/List
            probs: String
        """

        # Gets the predicted tags and probabilities
        pred_tags, probs = self.predicted_tags(sentence)

        # None response
        if pred_tags is None:
            return ("Sorry, I don't understand what you're asking me. Please try rewriting your query.", None, None), probs

        # Guess response
        elif isinstance(pred_tags, list):
            answer = "I'm not sure what you mean. Are you asking about:"
            tags = [tag for tag in pred_tags if tag not in self.filtered_tags]

            if len(tags) == 0:
                return ("Sorry, I don't understand what you're asking me. Please try rewriting your query.", None, None), probs

            responses = []
            for tag in tags:
                for section in self.raw_data:
                    if section['tag'] == tag:
                        responses.append(section['response'])
            return (answer, tags, responses), probs

        # normal response
        else:
            tag = pred_tags
            for section in self.raw_data:
                if section['tag'] == tag:
                    return (section['response'], tag, section['response']), probs


    def predicted_tags(self, sentence):
        """
        Uses the output of the model to get all possible tags.

        :param sentence: String
            Multiple words in a logical sequence
        :return:
            tag, a list of tags, or None
            probs_string: String
        """

        x = self.to_input_array(sentence)
        nn_output = self.model(x)
        probs = torch.softmax(nn_output, dim=1)[0]
        _, pred = torch.max(nn_output, dim=1)

        ps, indices = probs.sort(descending=True)
        probs_string = ""
        for p, idx in zip(ps, indices):
            probs_string = probs_string + f'{p:.3f}: {self.tags[idx]}\n'

        if probs[pred] > self.respond_threshold:
            return self.tags[pred], probs_string
        elif probs[pred] > self.guess_threshold:
            return self.best_guesses(probs), probs_string
        else:
            return None, probs_string


    def best_guesses(self, probs):
        """
        Calculates the best X tag guesses.

        :param probs: Pytorch Tensor
            Output probabilities
        :return: list of (tag, prob)
        """

        probs, indices = probs.sort(descending=True)
        responses = []
        prev_prob = 0
        for prob, idx in zip(probs, indices):
            gap = prev_prob - prob
            if gap/prev_prob > self.gap_ratio_threshold or len(responses) == self.max_guesses-1:
                break
            prev_prob = prob
            responses.append(self.tags[idx])
        return responses


    def to_input_array(self, sentence):
        """
        Creates a binary word occurrence array.

        :param sentence: String
            Multiple words in a logical sequence
        :return: [[float]] {0, 1} of length len(all_words)
        """

        words = self.nlp.tokenize(sentence)
        words = [self.nlp.spell.correction(w) for w in words]
        words = [self.nlp.stem(w) for w in words]
        words = [self.nlp.spell.correction(w) for w in words]
        ngrams = self.nlp.to_ngrams(words)

        x = np.zeros(len(self.all_words))

        for input_gram in ngrams:
            syn_gram = self.nlp.get_syn_gram(input_gram)
            for i, gram in enumerate(self.all_words):
                if self.nlp.ngrams_match(syn_gram, gram):
                    x[i] = 1

        x = x.reshape(1, x.shape[0])
        x = torch.from_numpy(x)
        x = x.to(dtype=torch.float)
        return x


    def get_prob(self, sentence, tag):
        """
        Gets the probability predicted by the model that the tag corresponds to the sentence.

        :param sentence: String
            Sentence to predict
        :param tag: String
            Tag that is possible output of the model
        :return:
            Probability that the tag matches the string
            The corresponding tag
        """

        x = self.to_input_array(sentence)
        nn_output = self.model(x)
        probs = torch.softmax(nn_output, dim=1)[0]
        _, pred = torch.max(nn_output, dim=1)
        return probs[self.tags.index(tag)], self.tags[pred]
