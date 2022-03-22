import spacy



if __name__ == "__main__":
    nlp = spacy.load("ger_spacy_ner_model")
    print(nlp("Ich hätte das Buch gerne bis März nach Berlin geliefert").ents)