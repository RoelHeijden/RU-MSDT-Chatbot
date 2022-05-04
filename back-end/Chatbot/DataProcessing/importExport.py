""" 
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.
 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree. 
"""

from Chatbot.Algorithm.neuralNetwork import NeuralNet
import torch


class File:
    """
    Class for importing/exporting a model state.

    Save or load a model state, parameters and other settings from/to
    a separate .pth file.
    """

    def __init__(self, file):
        """
        :param file: String
            Path to the model file
        """

        self.file = file


    def save(self, model, data, nlp_settings, output_settings):
        """
        Saves a neural network model

        Stores a network model and data in a separate .pth file.
        Includes the NLP and Output setting.

        :param model: neural network
            Trained neural network export from PyTorch
        :param data: wordData class instance
            Data class containing all_words, tags and xy

        :return: None
        """

        save_data = {
            "model state": model.state_dict(),
            "input size": model.input_size,
            "output size": model.output_size,
            "hidden size": model.hidden_size,
            "all words": data.all_words,
            "tags": data.tags,
            "raw data": data.raw_data,
            "nlp": nlp_settings,
            "output": output_settings
        }
        torch.save(save_data, self.file)
        print(f'Network saved to {self.file}')
        print()


    def load(self):
        """
        Loads a (trained) neural network.

        Opens a network model and data from a separate .pth file.
        Includes the NLP and Output setting.

        :return:
            model:           (Trained) neural network
            raw_data:        Dictionary with the training questions, tags and responses
            all_words:       List of all unique pattern words
            tags:            List of all unique tags
            nlp_settings:    NLP class settings matching the model
            output_settings: Output class settings matching the model
        """
        data = torch.load(self.file)

        model_state = data["model state"]
        input_size = data["input size"]
        output_size = data["output size"]
        hidden_size = data["hidden size"]
        all_words = data["all words"]
        tags = data["tags"]
        raw_data = data["raw data"]
        nlp_settings = data["nlp"]
        output_settings = data["output"]

        model = NeuralNet(input_size, output_size, hidden_size)
        model.load_state_dict(model_state)
        return model, raw_data, all_words, tags, nlp_settings, output_settings

