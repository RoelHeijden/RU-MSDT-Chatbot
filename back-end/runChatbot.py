"""
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
"""

import os
from utils import directoryFinder as df

class RunChatbot:
    """
    Simple class to start both the chatbotLocalServer.py and index.html with one click.
    """

    def __init__(self):
        """
        :param server_path: String
            Path to chatbotLocalServer.py
        :param index_path: String
            Path to index.html
        """

        self.server_path = "\"" + df.get_cur_dir(__file__) + "\\server\\chatbotLocalServer.py" + "\""
        self.index_path = "\"" + df.get_par_dir(__file__, 1) + "\\front-end\\index.html" + "\""

    def run(self):
        """
        Opens the html file and then executes chatbotLocalServer.py,
        throws fileNotFoundError when either cannot be opened.
        """

        try:
            os.system(self.index_path)
        except FileNotFoundError:
            print("The following file could not be opened: \n%s" % self.index_path)
        try:
            from server import chatbotLocalServer  # must run when executed itself, therefore run through an import
        except FileNotFoundError:
            print("The following file could not be opened: \n%s" % self.server_path)


RunChatbot().run()
