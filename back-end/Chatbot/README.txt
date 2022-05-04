readme last updated 15/12/2020


HOW THE DATA IS REPRESENTED

    The training data consists of a pattern, tag and response.
    eg: pattern: "hey, how are you?",
        tag: "greeting",
        response: "great, how are you?"

    worddata.py creates a list of all words that occurred in the patterns, and a list of all unique tags.
    eg: all_words: ["hey", "how", "are", "you", "hello", "bye"]
        tags: ["greeting", "ending"]

    trainingdata.py converts all patterns to binary word occurrence arrays with length len(all_words).
    eg: "hey, how are you?" becomes [1, 1, 1, 1, 0, 0]

    This data is used to train the neural network, with the output layer matching the tags.



USE FROM SERVER

    Run get_answer(string) from 'run.py' to get the output: (answer, tags, responses).



TRAINING THE NEURAL NETWORK

    Run 'training.py' to initialize and train the network. Creates 'data.pth', containing the network.

    Required downloads:
      - torch
      - nltk
      - numpy
      - pandas

    Required files:
      - trainingdata.csv
      - neuralnetwork.py
      - nlp.py
      - file.py
      - trainingdata.py
      - worddata.py



TESTING THE NEURAL NETWORK

    Run 'testing.py' to test the network via chat. Loads from 'data.pth'.

    Required downloads:
      - torch
      - nltk
      - numpy
      - pyspellchecker

    Required files:
      - data.pth (created after training)
      - neuralnetwork.py
      - nlp.py
      - file.py
      - output.py



