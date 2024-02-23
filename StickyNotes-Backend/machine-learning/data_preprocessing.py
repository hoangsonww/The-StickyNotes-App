import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer

def load_data(filename):
    data = pd.read_csv(filename)
    return data

def preprocess_data(data):
    data['text'] = data['text'].str.lower().str.replace(r'[^\w\s]+', '', regex=True)
    return data

def get_train_test_data(data):
    X_train, X_test, y_train, y_test = train_test_split(data['text'], data['sentiment'], test_size=0.2, random_state=42)
    return X_train, X_test, y_train, y_test

def vectorize_text(X_train, X_test):
    vectorizer = TfidfVectorizer(max_features=5000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    return X_train_vec, X_test_vec

def main():
    data = load_data('sentiment_data.csv')
    data = preprocess_data(data)
    X_train, X_test, y_train, y_test = get_train_test_data(data)
    X_train_vec, X_test_vec = vectorize_text(X_train, X_test)
    print(X_train_vec.shape)
    print(X_test_vec.shape)