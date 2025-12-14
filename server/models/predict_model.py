# --- File: akin-tunde-ccf-model/server/models/predict_model.py ---

import sys
import json
import joblib
import numpy as np
import os

# --- Configuration ---
# Determine the directory where the script is located (server/models)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def predict():
    """
    Loads the correct model and scaler, preprocesses the input, and returns a prediction.
    """
    try:
        # 1. Read input from Node.js (stdin)
        input_data = sys.stdin.read()
        payload = json.loads(input_data)
    except Exception:
        # Handle simple read/parse error
        print(json.dumps({'error': "Failed to read or parse input JSON."}))
        return

    model_name = payload.get('modelName')
    features_dict = payload.get('features')
    feature_order = payload.get('featureOrder') # The list of 15 RFE features

    if not model_name or not features_dict or not feature_order:
        print(json.dumps({'error': "Missing modelName, features, or featureOrder in input."}))
        return

    try:
        # 2. Load Model and Scaler
        model_filename = model_name.replace(" ", "_").lower()
        model_path = os.path.join(BASE_DIR, f'{model_filename}_model.pkl')
        scaler_path = os.path.join(BASE_DIR, 'time_amount_scaler.pkl')

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        # 3. Prepare data for prediction (Selection and Scaling)
        
        # Extract features in the correct order (15 RFE features)
        feature_vector_raw = np.array([features_dict[f] for f in feature_order], dtype=np.float64).reshape(1, -1)
        
        # --- Apply Scaling to Time and Amount ---
        time_index = feature_order.index('Time')
        amount_index = feature_order.index('Amount')
        
        # Extract the Time and Amount values (the columns that need scaling)
        time_amount_raw = feature_vector_raw[:, [time_index, amount_index]]
        
        # Apply the fitted scaler's transformation
        time_amount_scaled = scaler.transform(time_amount_raw)
        
        # Replace the raw Time and Amount values with the scaled ones in the feature vector
        feature_vector_raw[0, time_index] = time_amount_scaled[0, 0] # Time
        feature_vector_raw[0, amount_index] = time_amount_scaled[0, 1] # Amount

        feature_vector_final = feature_vector_raw

        # 4. Predict
        # We use predict_proba for confidence and the standard threshold of 0.5 for binary classification
        if hasattr(model, 'predict_proba'):
            prediction_proba = model.predict_proba(feature_vector_final)[0]
            
            # Probability of the positive class (1: Fraud)
            fraud_proba = prediction_proba[1] 
            
            # Prediction class (0 or 1) based on standard 0.5 threshold
            prediction_class_int = 1 if fraud_proba >= 0.5 else 0
            
            # Confidence is the probability of the predicted class
            confidence = round(prediction_proba[prediction_class_int] * 100)
            
        else:
            # Fallback (should not happen since we trained with probability=True)
            prediction_class_int = model.predict(feature_vector_final)[0]
            confidence = 100 # Default to max confidence if proba is unavailable
            
        prediction_class = 'fraud' if prediction_class_int == 1 else 'legitimate'

        # 5. Output Result (stdout)
        result = {
            "prediction": prediction_class,
            "confidence": confidence,
            "modelName": model_name
        }
        print(json.dumps(result))

    except Exception as e:
        # General ML execution error (e.g., failed to load model, feature mismatch)
        print(json.dumps({'error': f"ML Inference Error for {model_name}: {str(e)}"}))

if __name__ == "__main__":
    # Ensure the script only runs the function when executed as a process
    predict()