import pandas as pd
from sklearn.cluster import KMeans

def load_user_data(filename):
    return pd.read_csv(filename)

def cluster_user_behavior(data):
    # Assuming data has features representing user behavior
    kmeans = KMeans(n_clusters=3)
    clusters = kmeans.fit_predict(data)
    data['Cluster'] = clusters
    return data

def analyze_clusters(data):
    # Analyze each cluster for insights
    return data.groupby('Cluster').mean()

def main():
    user_data = load_user_data('user_data.csv')
    clustered_data = cluster_user_behavior(user_data)
    cluster_analysis = analyze_clusters(clustered_data)
    print(cluster_analysis)
