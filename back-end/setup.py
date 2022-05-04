"""
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
"""

import os
from utils import directoryFinder as df
import time

class Setup:
    """
    Class for installing the packages in requirements.txt and creating shortcut to run the server.
    """

    def __init__(self):
        """
        :param requirements: String
            Txt file with required packages
        """

        self.requirements = df.get_cur_dir(__file__) + "\\requirements.txt"
        self.data = df.get_par_dir(__file__, folder="back-end") + "\\Chatbot\\data\\data.pth"

    def install_packages(self):
        """
        Install the required packages for the project to run.

        :return: None
        """
        print("python will now attempt to install the required packages, this may take some time")
        time.sleep(2)
        os.system("pip install -r " + self.requirements)
        os.system("pip install torch===1.7.0 torchvision===0.8.1 torchaudio===0.7.0 -f https://download.pytorch.org/whl/torch_stable.html")

    def pre_train(self):
        """
        Train network the first time if it has not been trained yet.

        :return: None
        """
        print(self.data)
        if not os.path.exists(self.data):
            print("It appears the chatbot has not been trained, type 1 to train the chatbot for the first time in the following dialogue box")
            import Chatbot.main


setup = Setup()
setup.install_packages()

# imports need to be called after the packages are installed

setup.pre_train()

try:
    from utils.shortcutMaker import ShortcutMaker
except ImportError:
    print("win32con may not install correctly the first time")
    print("Try running the command \"python setup.py\" again to correctly install all the packages")

shortcut = ShortcutMaker("runChatbot")
shortcut.make()
