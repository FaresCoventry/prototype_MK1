import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import make_pipeline

import sys
import json

input_str = sys.stdin.buffer.read().decode('utf-8')
preferences = json.loads(input_str)

# Load dataset
df = pd.read_csv(r'C:\Users\PC\Desktop\FaresGradProject\Listings_filter_clean.csv')

# Preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['beds', 'price', 'livings', 'wc', 'area', 'ketchen', 'furnished', 'width', 'length']),
        ('cat', OneHotEncoder(), ['city', 'district'])
    ])

# Recommendation function
def recommend(user_preferences, n_recommendations=7):
    # Filter the DataFrame based on user preferences
    query_df = pd.DataFrame([user_preferences])
    query_df = query_df.reindex(columns=df.columns, fill_value=0)
    
    # Apply preprocessing
    pipeline = make_pipeline(preprocessor)
    df_processed = pipeline.fit_transform(df)
    query_processed = pipeline.transform(query_df)
    
    # Calculate cosine similarity
    similarity_scores = cosine_similarity(query_processed, df_processed)
    
    # Get top N recommendations
    top_n_indices = similarity_scores[0].argsort()[-n_recommendations:][::-1]
    recommendations = df.iloc[top_n_indices]
    
    return recommendations

# # Example user preferences
# user_preferences = {
#     'beds': 5,
#     'price': 1000000,
#     'livings': 2,
#     'wc': 2,
#     'area': 400,
#     'ketchen': 2,
#     'furnished': 1,
#     'city': 'الرياض',  # Example city in Arabic
#     'district': 'حي الرصيفة',  # Example district in Arabic
#     'width': 25,
#     'length': 45
# }

# Get recommendations
recommendations = recommend(preferences)
# print(json.dumps(recommendations))
recommendations_json = recommendations.to_json(orient="records")
print(recommendations_json)