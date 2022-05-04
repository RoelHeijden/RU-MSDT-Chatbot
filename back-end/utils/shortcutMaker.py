"""
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
"""

import winshell
import sys
from utils import directoryFinder as df

class ShortcutMaker:
    """
    Creates a windows shortcut using a batch file to run chatbotLocalServer and the index.html

    Current version is not guaranteed to work with other files and has not been tested for other files
    """

    def __init__(self, name, folder=df.get_par_dir(__file__,2), shortcut_location=winshell.desktop()):
        """
        Class for creating simple shortcuts of files

        :param name: String
            extensionless filename, relative folder compared to folder
        :param folder: String
            Folder to place batch file in
        :param shortcut_location: String
            Location to place the shortcut

        :param file: String
            location of file to be opened, used to link to python file and name batch file
        :param batch_location: String
            Location to place batch_file
        """
        self.name = name
        self.file = folder + "\\back-end\\" + self.name
        self.batch_location = folder + "\\" + self.name + ".bat"
        self.shortcut_location = shortcut_location + "\\" + self.name + ".lnk"


    def create_shortcut(self):
        """
        create shortcut to batch file
        """

        with winshell.shortcut(self.shortcut_location) as shortcut:
            print(self.batch_location)
            shortcut.path = self.batch_location


    def create_batch(self):
        """
        Create batch file that runs the commands to open the python file

        Writes cmd commands that will be executed when the batch file is executed
        """

        with open(self.batch_location, 'w') as file:
            file.write("REM %s" %self.name + "\n")

            file.write("@echo off\n")
            file.write("echo Command line: %0 %*\n")

            file.write(r'{}'.format(sys.executable))  # python used to run this file
            file.write(" " + "\"" + self.file + ".py" + "\"" + " " + "%0")  # file location

            file.write("\n")
            file.write("EXIT")

    def make(self):
        """
        Create batch file and shortcut for the desired file
        """

        self.create_batch()
        print("batch file created at ", self.batch_location)
        self.create_shortcut()
        print("shorcut created at ", self.shortcut_location)


