import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.cluster import KMeans
import os
# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
# Construct the path to the CSV file relative to the script
listings_path = os.path.join(current_dir, 'listings_rating_clean.csv')

def get_recommendations():
    # Load your dataset
    df = pd.read_csv(listings_path)

    # Features and target
    features = ['beds', 'price', 'category', 'livings', 'wc', 'area', 'ketchen', 'furnished', 'city', 'district', 'width', 'length']
    X = df[features]

    # Preprocessing
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['beds', 'price', 'category', 'livings', 'wc', 'area', 'ketchen', 'furnished', 'width', 'length']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['city', 'district'])
        ])

    # Create a pipeline for preprocessing
    pipeline = Pipeline([
        ('preprocessor', preprocessor)
    ])

    # Apply preprocessing to the entire dataset
    X_processed = pipeline.fit_transform(X)

    # Clustering
    n_clusters = 5
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    df['cluster'] = kmeans.fit_predict(X_processed)  # Fit and predict clusters for the whole dataset

    # Evaluate each cluster and select the top 2 properties based on user reviews
    top_recommendations = pd.DataFrame()
    for cluster_id in range(n_clusters):
        cluster_data = df[df['cluster'] == cluster_id]
        top_properties = cluster_data.nlargest(3, 'user.review')
        top_recommendations = pd.concat([top_recommendations, top_properties])

    # Return top recommendations as JSON
    return top_recommendations.to_json(orient='records')

# Example usage
if __name__ == "__main__":
    recommendations_json = get_recommendations()
    print(recommendations_json)
