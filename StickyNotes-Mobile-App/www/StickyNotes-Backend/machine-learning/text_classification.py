import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

def load_text_data(filename):
    return pd.read_csv(filename)

def create_text_classifier():
    text_clf = make_pipeline(TfidfVectorizer(), MultinomialNB())
    return text_clf

def train_classifier(classifier, data, labels):
    classifier.fit(data, labels)

def classify_text(classifier, text):
    return classifier.predict([text])

def main():
    text_data = load_text_data('text_data.csv')
    text_classifier = create_text_classifier()
    train_classifier(text_classifier, text_data['Text'], text_data['Category'])
    category = classify_text(text_classifier, "Sample note content")
    print(category)
# Path: machine-learning/text_classification.py