import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
listings_path = os.path.join(current_dir, 'listings_rating_clean.csv')

def get_recommendations():

    df = pd.read_csv(listings_path)

    # Features and target
    features = ['beds', 'price', 'category', 'livings', 'wc', 'area', 'ketchen', 'furnished', 'city', 'district', 'width', 'length']
    X = df[features]
    y = df['user.review']  # Assuming user.review is the column with the ratings

    # Preprocessing
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), ['beds', 'price', 'category', 'livings', 'wc', 'area', 'ketchen', 'furnished', 'width', 'length']),
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['city', 'district'])
        ])

    # Create a pipeline for preprocessing
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=10, random_state=42))  # Adding RandomForestRegressor to the pipeline
    ])

    # Clustering
    n_clusters = 5
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    df['cluster'] = kmeans.fit_predict(pipeline.named_steps['preprocessor'].fit_transform(X))

    # Evaluate each cluster and select the top properties based on RandomForest predictions
    top_recommendations = pd.DataFrame()
    for cluster_id in range(n_clusters):
        cluster_data = df[df['cluster'] == cluster_id]
        X_cluster = cluster_data[features]
        y_cluster = cluster_data['user.review']

        # Split data for training the RandomForest model within each cluster
        X_train, X_test, y_train, y_test = train_test_split(X_cluster, y_cluster, test_size=0.2, random_state=42)

        # Fit the RandomForest model
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        # Attach predictions back to test set for ranking
        X_test['predicted_review'] = y_pred
        top_properties = X_test.sort_values(by='predicted_review', ascending=False).head(3)  # Get top 3 properties based on predicted ratings

        # Make sure to include the ID field in the final DataFrame
        top_properties = cluster_data.loc[top_properties.index]
        top_recommendations = pd.concat([top_recommendations, top_properties])

    # Return top recommendations as JSON, ensuring to return only the relevant details
    return top_recommendations.to_json(orient='records')

# Example usage
if __name__ == "__main__":
    recommendations_json = get_recommendations()
    print(recommendations_json)
