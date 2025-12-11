import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface ModelMetrics {
  f1_score: number;
  precision: number;
  recall: number;
  auc_roc: number;
  auprc: number;
}

interface ModelMetricsData {
  [key: string]: ModelMetrics;
}

let modelMetrics: ModelMetricsData | null = null;
let featureNames: string[] | null = null;

export function getModelMetrics(): ModelMetricsData {
  if (modelMetrics === null) {
    const metricsPath = path.join(__dirname, "models", "model_metrics.json");
    if (fs.existsSync(metricsPath)) {
      const data = fs.readFileSync(metricsPath, "utf-8");
      modelMetrics = JSON.parse(data);
    } else {
      modelMetrics = {
        "Logistic Regression": {
          f1_score: 0.1056,
          precision: 0.056,
          recall: 0.9184,
          auc_roc: 0.9669,
          auprc: 0.7153,
        },
        "Random Forest": {
          f1_score: 0.8701,
          precision: 0.9747,
          recall: 0.7857,
          auc_roc: 0.9531,
          auprc: 0.8846,
        },
        "Support Vector Machine": {
          f1_score: 0.0081,
          precision: 0.0041,
          recall: 0.9082,
          auc_roc: 0.9245,
          auprc: 0.6434,
        },
      };
    }
  }
  return modelMetrics as ModelMetricsData;
}

export function getFeatureNames(): string[] {
  if (featureNames === null) {
    const featuresPath = path.join(__dirname, "models", "feature_names.json");
    if (fs.existsSync(featuresPath)) {
      const data = fs.readFileSync(featuresPath, "utf-8");
      featureNames = JSON.parse(data);
    } else {
      featureNames = [
        "Time",
        "V1",
        "V4",
        "V5",
        "V8",
        "V10",
        "V12",
        "V13",
        "V14",
        "V16",
        "V17",
        "V20",
        "V22",
        "V28",
        "Amount",
      ];
    }
  }
  return featureNames as string[];
}

export function getAvailableModels(): string[] {
  return ["Logistic Regression", "Random Forest", "Support Vector Machine"];
}

export interface PredictionInput {
  [key: string]: number;
}

export interface PredictionResult {
  prediction: "fraud" | "legitimate";
  confidence: number;
  modelName: string;
}

/**
 * Mock prediction function - in production, this would load and use actual sklearn models
 * For now, we'll use a simple heuristic based on the features
 */
export function predictFraud(
  modelName: string,
  features: PredictionInput
): PredictionResult {
  const metrics = getModelMetrics()[modelName];
  if (!metrics) {
    throw new Error(`Model ${modelName} not found`);
  }

  // Simple heuristic: use a combination of features to make a prediction
  // In production, this would use the actual trained sklearn models
  const amount = features.Amount || 0;
  const time = features.Time || 0;
  const v1 = features.V1 || 0;
  const v4 = features.V4 || 0;

  // Calculate a fraud score based on feature values
  let fraudScore = 0;

  // Heuristic rules based on typical fraud patterns
  if (amount > 1000) fraudScore += 0.2;
  if (amount < 10) fraudScore += 0.1;
  if (Math.abs(v1) > 2) fraudScore += 0.15;
  if (Math.abs(v4) > 2) fraudScore += 0.15;

  // Model-specific adjustments
  switch (modelName) {
    case "Random Forest":
      fraudScore *= 1.2; // Random Forest tends to be more conservative
      break;
    case "Logistic Regression":
      fraudScore *= 0.8; // Logistic Regression is more aggressive
      break;
    case "Support Vector Machine":
      fraudScore *= 0.9;
      break;
  }

  // Ensure score is between 0 and 1
  fraudScore = Math.min(Math.max(fraudScore, 0), 1);

  // Use model's recall as threshold for prediction
  const threshold = 1 - metrics.recall;

  const isFraud = fraudScore > threshold;
  const confidence = Math.round((isFraud ? fraudScore : 1 - fraudScore) * 100);

  return {
    prediction: isFraud ? "fraud" : "legitimate",
    confidence,
    modelName,
  };
}
