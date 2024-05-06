import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

# Load your dataset
df = pd.read_csv(r'C:\Users\PC\Desktop\FaresGradProject\listings_rating_clean.csv')


X = df[['beds', 'price', 'category', 'livings', 'wc', 'area', 'ketchen', 'furnished', 'city', 'district', 'width', 'length']]  # Features
y = df['user.review']

# Preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['beds', 'price', 'category', 'livings', 'wc', 'area', 'ketchen', 'furnished', 'width', 'length']),  # Normalize numerical columns
        ('cat', OneHotEncoder(handle_unknown='ignore'), ['city', 'district'])  # Encode categorical columns
    ])

# Random Forest for regression
regressor = RandomForestRegressor(n_estimators=100, random_state=42)

# Complete pipeline: from preprocessing to regression
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', regressor)
])

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
pipeline.fit(X_train, y_train)

# Evaluate the model
y_pred = pipeline.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f'Mean Squared Error: {mse}')

# Function to recommend properties based on their predicted ratings
def recommend(properties, model, top_n=5):
    # Predict ratings
    properties['predicted_rating'] = model.predict(properties)
    # Return top n properties sorted by predicted ratings
    return properties.sort_values(by='predicted_rating', ascending=False).head(top_n)

# Example: Recommend top 5 properties
recommended_properties = recommend(df, pipeline, top_n=5)
print(recommended_properties)
