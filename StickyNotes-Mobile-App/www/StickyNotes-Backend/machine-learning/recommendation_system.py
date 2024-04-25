import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

def load_preference_data(filename):
    return pd.read_csv(filename)

def calculate_similarity(data):
    similarity_matrix = cosine_similarity(data)
    return similarity_matrix

def recommend_items(user_id, similarity_matrix, data):
    user_index = data.index[data['UserID'] == user_id][0]
    similarity_scores = list(enumerate(similarity_matrix[user_index]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    top_items_indices = [i[0] for i in similarity_scores[1:6]]  # Top 5 items
    return data.iloc[top_items_indices]['ItemID']

def main():
    preference_data = load_preference_data('preference_data.csv')
    similarity_matrix = calculate_similarity(preference_data)
    recommendations = recommend_items(123, similarity_matrix, preference_data)
    print(recommendations)
# Path: machine-learning/recommendation_system.py