import pickle
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Load the pre-trained TF-IDF vectorizer, composition matrix, and dataset
tfidf_model_path = "app/models/tfidf_model.pkl"
composition_matrix_path = "app/models/composition_matrix.pkl"
data_path = "app/models/meds.csv"  # Path to your dataset

with open(tfidf_model_path, "rb") as file:
    tfidf_model = pickle.load(file)

with open(composition_matrix_path, "rb") as file:
    composition_matrix = pickle.load(file)

# Load the dataset
data = pd.read_csv(data_path)

# Fill missing values in compositions
data['short_composition1'] = data['short_composition1'].fillna('')
data['short_composition2'] = data['short_composition2'].fillna('')

# Combine compositions for similarity comparison
data['combined_composition'] = data['short_composition1'] + ' ' + data['short_composition2']


def predict_alternative_medicine(drug_name: str, top_n: int = 5):
    """
    Predicts alternative medicines based on a specific drug name using composition similarity.

    Args:
        drug_name (str): The name or partial name of the drug to use as reference.
        top_n (int): Number of alternative medicines to return.

    Returns:
        pd.DataFrame: A dataframe containing the recommended medicines and their compositions.
    """
    # Find matching drugs by partial name
    matching_drugs = data[data['name'].str.contains(drug_name, case=False, na=False)]
    if matching_drugs.empty:
        return f"Drug with name containing '{drug_name}' not found in the dataset."

    # Use the first match as the reference drug
    drug_index = matching_drugs.index[0]
    drug_vector = composition_matrix[drug_index]

    # Calculate cosine similarity for the selected drug
    similarity_scores = cosine_similarity(drug_vector, composition_matrix).flatten()

    # Sort by similarity score in descending order
    similar_indices = np.argsort(-similarity_scores)

    # Exclude the input drug itself and get the top_n recommendations
    recommended_indices = [idx for idx in similar_indices if idx != drug_index][:top_n]
    recommendations = data.iloc[recommended_indices][['name', 'combined_composition']]

    return recommendations
