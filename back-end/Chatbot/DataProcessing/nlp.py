""" 
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree. 
"""

import string, nltk
from nltk.stem.porter import PorterStemmer
from spellchecker import SpellChecker
from nltk.corpus import wordnet
nltk.download("punkt")
nltk.download("wordnet")


class NLP:
    """
    Natural language processing tools.

    Various functions for processing natural language.
    """

    def __init__(self, nlp_settings):
        """
        :param nlp_settings: List
            [0]: Int
                Spellcheck distance
            [1]: Boolean
                Check for synonyms
            [2]: Int
                Ngram tuple size
        """

        self.stemmer = PorterStemmer()
        self.spell = SpellChecker(distance=nlp_settings[0])
        self.check_synonyms = nlp_settings[1]
        self.n_gram_size = nlp_settings[2]


    def tokenize(self, sentence):
        """
        Tokenizes a sentence.

        Splits a string into separate sentences.
        Splits those sentences into separate lists of words.
        Removes punctuation.

        :param sentence: String
            Multiple sentences
        :return: List
            Multiple words
        """

        wordlist = [nltk.word_tokenize(s) for s in nltk.sent_tokenize(sentence)]
        wordlist_flat = [i for sub in wordlist for i in sub]

        for word in wordlist_flat:
            if len(word) == 1:
                if word in string.punctuation:
                    wordlist_flat.remove(word)
        return wordlist_flat


    def stem(self, word):
        """
        Stems a words

        Simplifies a word and removes upper cases,
        eg: "Eating" -> "eat".

        :param word: String
            A word
        :return: String
            A stemmed word
        """
        return self.stemmer.stem(word.lower())


    def get_syn_gram(self, ngram):
        """
        Makes synonym n_grams.

        Forms an n_gram with the stemmed synonyms,
        eg: (help, cat) would become: ([help, aid, assist, ..], [cat, ..]).

        :param ngram: tuple of Strings
            Ngram of n words
        :return: tuple of list of Strings
            Ngram of n lists of words
        """
        if not self.check_synonyms:
            return ngram

        syn_gram = ()
        for w in ngram:
            syn_list = []
            syns = wordnet.synsets(w)

            for syn in syns:
                for l in syn.lemmas():
                    syn_list.append(self.stem(l.name()))

            if len(syn_list) == 0:
                syn_gram += (self.stem(w),)
            else:
                syn_gram += (set(syn_list),)

        return syn_gram


    def to_ngrams(self, words):
        """
        Forms n ngrams from a list of words.

        Combines words to tuples of size n.
        Adds the start sentence sign "#" and the end sentence sign "EOS".

        Example of n == 2:
        [The, dog, barks] becomes:
        [(#, The), (The, dog), (dog, barks), (barks, EOS)]

        :param words: list of Strings
            List of words
        :return: list of tuples
            List of n_grams
        """
        ngrams = []
        for i in range(-1, len(words) + 1):

            # not enough words left for another ngram
            if i > len(words) - (self.n_gram_size - 1):
                break

            # only one ngram can be made
            elif len(words) == self.n_gram_size - 2:
                gram = ("#",)
                for n in range(len(words)):
                    gram = gram + (words[n],)
                gram = gram + ("EOS",)

            # start of sentence ngram
            elif i == -1:
                gram = ("#",)
                for n in range(1, self.n_gram_size):
                    gram = gram + (words[i + n],)

            # end of sentence ngram
            elif i == len(words) - (self.n_gram_size - 1):
                gram = ()
                for n in range(self.n_gram_size - 1):
                    gram = gram + (words[i + n],)
                gram = gram + ("EOS",)

            # regular ngram
            else:
                gram = (words[i],)
                for n in range(1, self.n_gram_size):
                    gram = gram + (words[i + n],)

            ngrams.append(gram)
        return ngrams


    def ngrams_match(self, syn_gram, ngram):
        """
        Checks if to ngrams are 'equal'.

        :param syn_gram: Tuple
            Ngram of synonyms
        :param ngram: Tuple
            Ngram
        :return: Boolean
        """
        for syns, word in zip(syn_gram, ngram):
            if word not in syns:
                return False
        return True

