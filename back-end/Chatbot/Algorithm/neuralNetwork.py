""" 
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree. 
"""

import torch.nn as nn


class NeuralNet(nn.Module):
    """
    Neural network using the Torch module.

    Feed forward neural network:
        1 input layer with size == len(all unique words)
        1 output layer with size == len(all unique tags)
        1 hidden layer with ReLU activation
    """

    def __init__(self, input_size, output_size, hidden_size):
        """
        :param input_size: Int
            Length of the input layer
        :param output_size: Int
            Length of the output layer
        :param hidden_size: Int
            Length of the hidden layer
        """

        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size

        super(NeuralNet, self).__init__()
        self.l1 = nn.Linear(input_size, hidden_size)
        self.l2 = nn.Linear(hidden_size, output_size)
        self.activation = nn.ReLU()


    def forward(self, x):
        """
        The forward pass

        Computes an output of the network given input x.

        :param x: Array
            Network input
        :return: Tensor
            Output of the network
        """
        out = self.l1(x)
        out = self.activation(out)
        out = self.l2(out)
        return out

