
## requirements

- rasa 2.8.2

- spaCy 3.2.1

- base language model from spaCy de_core_news_md

  

## Getting started

# install dependencies

1. Within an environment of your choice, install the following dependencies

```bash

pip install -U spacy==3.2.1 spacy_fastlang==1.0.1 rasa==2.8.2
```

2. Download a pretrained base german language model.

```bash
python -m spacy download de_core_news_md
```  
 For more options visit https://github.com/explosion/spacy-models/releases

# Training

**1. Training NLU model in spaCy**

  

First, review base_config.cfg file. Feel free to modify the configurations:

1. add more components
2. enable gpu training
3. change languge
4. modify NLU architecture or the hyperparameters

visit https://spacy.io/usage/training for more info.

Make sure train and dev in base_config.cfg file point to the correct directory of your train and test data.
In the nlu_training directory, run the following commands:
```bash
# init config file
python -m spacy init fill-config base_config.cfg config.cfg
# train the model
python -m spacy train config.cfg --output ./output
```

**2. Training the final model in Rasa**

1. if the first training was successful, you should find **mode-best** in the output directory.
Copy the content of **model-best** to **rasa/ger-spacy-ner-model** in the main project directory

```bash
# clean up ger-spacy-ner-model first
sudo rm -rf ../rasa/ger-spacy-ner-model
# copy new model in
cp ./output/model-best/* ../rasa/ger-spacy-ner-model
```

2. To adapt the final model to the designed chatbot stories in rasa directory run

```bash
# go to rasa directory
cd ../rasa
# train the model on the scenarios in yml files
rasa train
```

3. You can test the model in interactive mode with:

```bash
rasa shell
```

You can also check the output of the individual components of the NLU pipeline in json format by running:

```bash
rasa shell nlu
```


For more commands see the documentation on the rasa [command line interface](https://rasa.com/docs/rasa/command-line-interface)
  

```
rasa

│ README.md

│

│

└───ger_spacy_ner_model (retrained de_core_news_sm spaCy model using the annotated data in awt-pj-ws21-22-chatbot-semantics-2/annotated_data)

│

└───data

│ nlu.yml (NLU training data stores structured information about user messages including user intents)

│ rules.yml (Rules are a type of training data used to train your assistant's dialogue management model. Rules describe short pieces of conversations that should always follow the same path.)

│ stories.yml (Stories are a type of training data used to train your assistant's dialogue management model. Stories can be used to train models that are able to generalize to unseen conversation paths.)

```
