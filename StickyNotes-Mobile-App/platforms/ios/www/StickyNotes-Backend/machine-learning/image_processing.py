from PIL import Image
import numpy as np
from sklearn.decomposition import PCA

def load_image(path):
    return Image.open(path)

def preprocess_image(image):
    return np.array(image).flatten()

def extract_features(image_array):
    pca = PCA(n_components=50)  # Reducing to 50 features
    transformed = pca.fit_transform([image_array])
    return transformed[0]

def main():
    image = load_image('path/to/image.jpg')
    image_array = preprocess_image(image)
    features = extract_features(image_array)
    print(features)