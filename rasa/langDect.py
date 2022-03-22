from rasa.nlu.components import Component
import spacy
import spacy_fastlang
    
class LangDetect(Component):
    nlp = spacy.load('de_core_news_md')
    nlp.add_pipe("language_detector")

    def __init__(self, component_config=None):
        super(LangDetect, self).__init__(component_config)

    def train(self, training_data, cfg, **kwargs):
        """Not needed, because the the model is lexical"""
        pass

    def process(self, message, **kwargs):
        """Retrieve the text message, pass it to the classifier
            and append the prediction results to the message class."""

        msg = message.get("text")
        if msg != None:
            confidence = self.nlp(msg)._.language_score
            message.set("langDetect", confidence, add_to_output=True)

    def persist(self, file_name, model_dir):
        """Pass because a pre-trained model is already persisted"""
        pass
