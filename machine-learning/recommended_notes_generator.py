import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

data = pd.read_csv('user_notes_data.csv') # Protected file, not available in this repository

data = pd.get_dummies(data, columns=['time_of_day', 'user_mood', 'weather'])

X = data.drop('note_category', axis=1)
y = data['note_category']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

classifier = RandomForestClassifier(n_estimators=100, random_state=42)
classifier.fit(X_train, y_train)

# Model Prediction
y_pred = classifier.predict(X_test)

# Model Evaluation
print(f'Accuracy: {accuracy_score(y_test, y_pred)}')

# Function to predict note category
def predict_note_category(time_of_day, user_mood, weather):
    input_data = {'time_of_day': [time_of_day], 'user_mood': [user_mood], 'weather': [weather]}
    input_data = pd.DataFrame(input_data)
    input_data = pd.get_dummies(input_data)
    prediction = classifier.predict(input_data)
    return prediction[0]