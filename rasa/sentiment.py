from rasa.nlu.components import Component
from rasa.nlu import utils
from rasa.nlu.model import Metadata
import os, sys

sys.path.append('./sentiment')
from vaderSentimentGER import sentimentOne

class SentimentAnalyzer(Component):
    """A GERVader pre-trained sentiment component"""

    def __init__(self, component_config=None):
        super(SentimentAnalyzer, self).__init__(component_config)

    def train(self, training_data, cfg, **kwargs):
        """Not needed, because the the model is lexical"""
        print("Train Sentiment")
        pass

    def process(self, message, **kwargs):
        """Retrieve the text message, pass it to the classifier
            and append the prediction results to the message class."""

        seintiment_score = sentimentOne(message.get("text"))        
        message.set("sentiment", seintiment_score, add_to_output=True)

    def persist(self, file_name, model_dir):
        """Pass because a pre-trained model is already persisted"""
        pass