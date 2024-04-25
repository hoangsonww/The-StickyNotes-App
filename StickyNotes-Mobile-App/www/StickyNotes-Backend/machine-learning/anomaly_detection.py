import pandas as pd
from sklearn.ensemble import IsolationForest

def load_data(filename):
    return pd.read_csv(filename)

def detect_anomalies(data):
    model = IsolationForest(n_estimators=100, contamination=0.01)
    data['anomaly'] = model.fit_predict(data)
    anomalies = data[data['anomaly'] == -1]
    return anomalies

def main():
    user_data = load_data('user_activity.csv')
    anomalies = detect_anomalies(user_data)
    print(anomalies)
