from textblob import TextBlob

def analyze_sentiment(text):
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity
    if polarity > 0:
        return 'Positive'
    elif polarity == 0:
        return 'Neutral'
    else:
        return 'Negative'

# Test data
def main():
    text = "I love using this app. It's so user-friendly!"
    sentiment = analyze_sentiment(text)
    print(sentiment)
    print('Done')
