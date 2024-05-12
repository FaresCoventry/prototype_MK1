import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error

def get_recommendations():
    # Load your dataset
    df = pd.read_csv(r'C:\Users\PC\Desktop\FaresGradProject\listings_rating_clean.csv')


    # Features and target
    features = ['beds', 'price', 'category', 'livings', 'wc', 'area', 'ketchen', 'furnished', 'city', 'district', 'width', 'length']
    X = df[features]
    y = df['user.review']


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


    # split the data if needed for further modeling or training
    X_train, X_test, y_train, y_test = train_test_split(df, y, test_size=0.2, random_state=42)


    # Random Forest for regression within each cluster
    performance_metrics = {}
    for cluster in range(n_clusters):
        cluster_data = df[df['cluster'] == cluster]
        X_cluster = cluster_data.drop(['user.review', 'cluster'], axis=1)
        y_cluster = cluster_data['user.review']
        
        X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_cluster, y_cluster, test_size=0.2, random_state=42)
        pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('regressor', RandomForestRegressor(n_estimators=10, random_state=42))
        ])
        
        pipeline.fit(X_train_c, y_train_c)
        y_pred_c = pipeline.predict(X_test_c)
        mse_c = mean_squared_error(y_test_c, y_pred_c)
        mae_c = mean_absolute_error(y_test_c, y_pred_c)
        performance_metrics[cluster] = (mse_c, mae_c)
        print(f'Cluster {cluster} - Mean Squared Error: {mse_c}, Mean Absolute Error: {mae_c}')



    # Recommendation function (can be refined based on specific criteria)
    def recommend_from_cluster(cluster_id, top_n=5):
        cluster_data = df[df['cluster'] == cluster_id]
        top_recommendations = cluster_data.sort_values(by='user.review', ascending=False).head(top_n)
        return top_recommendations


    # Example: Get top 5 recommendations from cluster 0
    top_properties = recommend_from_cluster(3, top_n=5)
    print(top_properties)


    # Evaluate each cluster and select the top 2 properties based on user reviews
    top_recommendations = pd.DataFrame()
    for cluster_id in range(n_clusters):
        cluster_data = df[df['cluster'] == cluster_id]
        top_properties = cluster_data.nlargest(2, 'user.review')
        top_recommendations = pd.concat([top_recommendations, top_properties])

    return top_recommendations.to_json(orient='records')

# Example usage
if __name__ == "__main__":
    recommendations_json = get_recommendations()
    print(recommendations_json)
