from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score
import joblib
import data_preprocessing as dp

def train_model(X_train, y_train):
    model = MultinomialNB()
    model.fit(X_train, y_train)
    return model

def evaluate_model(model, X_test, y_test):
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f'Model Accuracy: {accuracy}')

def save_model(model, filename):
    joblib.dump(model, filename)

def main():
    data = dp.load_data('sentiment_data.csv')
    data = dp.preprocess_data(data)
    X_train, X_test, y_train, y_test = dp.get_train_test_data(data)
    X_train_vec, X_test_vec = dp.vectorize_text(X_train, X_test)

    model = train_model(X_train_vec, y_train)
    evaluate_model(model, X_test_vec, y_test)
    save_model(model, 'sentiment_model.pkl')
