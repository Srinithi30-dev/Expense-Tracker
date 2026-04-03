from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

# -----------------------------
# CATEGORY CLASSIFIER
# -----------------------------
def categorize(desc):
    desc = str(desc).lower()

    if any(x in desc for x in ["zomato","swiggy","restaurant","food","cafe","pizza"]):
        return "Food"

    elif any(x in desc for x in ["uber","ola","rapido","metro","bus","train"]):
        return "Travel"

    elif any(x in desc for x in ["amazon","flipkart","shopping","myntra"]):
        return "Shopping"

    elif any(x in desc for x in ["netflix","spotify","movie"]):
        return "Entertainment"

    elif any(x in desc for x in ["electricity","bill","recharge","jio","airtel"]):
        return "Utilities"

    else:
        return "Other"

# -----------------------------
# MAIN API
# -----------------------------
@app.route("/analyze", methods=["POST"])
def analyze():

    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    df = pd.read_csv(file)

    df.columns = df.columns.str.lower()

    df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
    df["date"] = pd.to_datetime(df["date"], errors="coerce")

    df = df.dropna()

    # Categorization
    df["category"] = df["description"].apply(categorize)

    # -----------------------------
    # ANALYTICS
    # -----------------------------

    total_spend = df["amount"].sum()

    category_data = (
        df.groupby("category")["amount"]
        .sum()
        .reset_index()
        .to_dict(orient="records")
    )

    payment_data = (
        df.groupby("payment_mode")["amount"]
        .sum()
        .reset_index()
        .to_dict(orient="records")
    )

    trend = (
        df.groupby("date")["amount"]
        .sum()
        .reset_index()
    )

    trend["date"] = trend["date"].astype(str)

    trend_data = trend.to_dict(orient="records")

    # -----------------------------
    # RESPONSE
    # -----------------------------
    return jsonify({
        "total_spend": float(total_spend),
        "category_data": category_data,
        "payment_data": payment_data,
        "trend": trend_data
    })


# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)