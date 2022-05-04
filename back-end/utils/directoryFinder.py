"""
 Copyright (c) 2021, Sanne Janssen, Hilde Kerkhoven,
 Savannah Hazeleger, Roel van der Heijden, Thijmen van Buuren, Lars Boere, Lisa Hensens.
 All rights reserved.

 This source code is licensed under the BSD-style license found in the
 LICENSE file in the root directory of this source tree.
"""
import os

"""
File for reliably finding the current directory and the parent directory of a file
"""


def get_cur_dir(file):
    """
    Finds the current directory of the file

    :param file: String
        Location of current file
    :return: current directory of file
    """

    return os.path.dirname(os.path.realpath(file))


def get_par_dir(file, up=1, folder=""):
    """
    Finds the parent directory of the folder of the file

    Goes a number of directories up equal to up, or goes up to the specified folder if one is provided

    :param filename: String
        Location of current file
    :return: dir that is parent of dir file is in
    :param: up: int
        How many directories to go up
    :param folder:
        Folder to go up to

    :return: The parent folder path
    """
    if folder != "":
        folder = folder.lower()
        par_dir = get_cur_dir(file)

        try:
            while True:
                par_dir, current = par_dir.rsplit("\\", 1)

                if current.lower() == folder:
                    par_dir = par_dir + "\\" + current
                    break
            return par_dir

        except FileNotFoundError:
            print("The folder: {} could not be found".format(folder))

    return get_cur_dir(file).rsplit("\\", up)[0]