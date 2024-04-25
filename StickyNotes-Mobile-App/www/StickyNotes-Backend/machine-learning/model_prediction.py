import joblib

def load_model(filename):
    model = joblib.load(filename)
    return model

def predict_sentiment(model, vectorizer, text):
    text_vec = vectorizer.transform([text])
    prediction = model.predict(text_vec)
    return prediction[0]

def main():
    model = load_model('sentiment_model.pkl')
    sentiment = predict_sentiment(model, vectorizer, "I love this app!")
    print(sentiment)
