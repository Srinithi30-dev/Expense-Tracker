import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Training dataset
train_data = pd.DataFrame({
    "text":[
        "zomato order","swiggy food","uber ride","metro travel",
        "amazon shopping","flipkart order","movie ticket",
        "petrol pump","grocery store","big bazaar"
    ],
    "category":[
        "Food","Food","Travel","Travel",
        "Shopping","Shopping","Entertainment",
        "Transport","Groceries","Groceries"
    ]
})

# Vectorization
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(train_data["text"])

# Model
model = LogisticRegression()
model.fit(X, train_data["category"])


def predict_category(text):
    X_test = vectorizer.transform([text])
    return model.predict(X_test)[0]


def apply_ml_category(df):
    df["category"] = df["description"].apply(predict_category)
    return df