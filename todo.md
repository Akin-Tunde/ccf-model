# Credit Card Fraud Detection Application - TODO

## Core Features

- [x] Train and save all three ML models (Logistic Regression, Random Forest, SVM) with optimal RFE feature sets
- [x] Create database schema for model metadata and prediction history
- [x] Build tRPC procedures for model selection, feature validation, and fraud prediction
- [x] Create fraud detection interface with model selector dropdown
- [x] Implement dynamic input form with 15 feature fields (Time, Amount, V1, V4, V5, V8, V10, V12, V13, V14, V16, V17, V20, V22, V28)
- [x] Display real-time fraud prediction results (Fraud/Legitimate with confidence percentage)
- [x] Implement model performance metrics display (F1-Score, AUPRC, Precision, Recall)
- [x] Create visualization panel with model comparison charts (AUPRC, F1-Score, Feature Count Impact)
- [x] Write Vitest tests for tRPC procedures and model inference logic
- [ ] Deploy application and expose public URL

## UI/UX Components

- [x] Model selection dropdown component
- [x] Feature input form with 15 fields
- [x] Prediction result display card
- [x] Performance metrics display card
- [x] Visualization panel with charts
- [x] Navigation and layout structure

## Data & Models

- [x] Load and preprocess training data from CSV files
- [x] Train Logistic Regression model with RFE features
- [x] Train Random Forest model with RFE features
- [ ] Train Support Vector Machine model with RFE features (long training time)
- [x] Save trained models to disk for inference
- [x] Create model performance metrics reference data

## Testing & Validation

- [x] Test model inference with sample data
- [x] Test tRPC procedures for prediction endpoint
- [x] Test feature validation logic
- [x] Test model selection and switching
- [x] Validate prediction output format

## Deployment

- [x] Set up environment variables for model paths
- [x] Configure database for prediction history (optional)
- [ ] Test application in production environment
- [ ] Expose public URL for user access
