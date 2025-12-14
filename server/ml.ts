// --- File: akin-tunde-ccf-model/server/ml.ts (Full Fixed Code) ---

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process"; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- ABSOLUTE PYTHON PATH CONFIGURATION ---
// This ensures Node.js uses the Python environment that has the ML libraries installed.
const PYTHON_EXE_PATH = 'python';
// ------------------------------------------


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
      // Fallback data (matches your notebook output for RFE 15)
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
      // Fallback data (RFE 15 features)
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
 * Executes a Python script to load the trained model and perform prediction.
 */
export async function predictFraud(
  modelName: string,
  features: PredictionInput
): Promise<PredictionResult> {
  // 1. Get the list of features in the correct order (RFE 15 features)
  const featureOrder = getFeatureNames();
  
  // 2. Prepare the payload for the Python script
  const payload = {
    modelName: modelName,
    features: features,
    featureOrder: featureOrder,
  };

  return new Promise((resolve, reject) => {
    // 3. Spawn the Python process
    const scriptPath = path.join(__dirname, "models", "predict_model.py");
    
    // Use the absolute path provided
    const pythonProcess = spawn(PYTHON_EXE_PATH, [scriptPath]); 

    let stdoutData = "";
    let stderrData = "";

    // 4. Send payload to Python via stdin
    pythonProcess.stdin.write(JSON.stringify(payload));
    pythonProcess.stdin.end();

    // 5. Collect output and errors
    pythonProcess.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    // 6. Handle process exit
    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`[ML Bridge] Python script exited with code ${code}. Error: ${stderrData}`);
        return reject(new Error("Prediction failed: Internal ML service error."));
      }

      try {
        const result = JSON.parse(stdoutData);
        
        if (result.error) {
            // Error reported by the Python script itself
            console.error(`[ML Bridge] Python reported error: ${result.error}`);
            return reject(new Error(`Prediction failed: ${result.error}`));
        }

        // Final validation
        if (typeof result.prediction !== 'string' || typeof result.confidence !== 'number' || result.prediction.length === 0) {
            throw new Error("Invalid or empty result format from Python script.");
        }

        resolve(result as PredictionResult);

      } catch (e) {
        console.error('Failed to parse Python output:', stdoutData, e);
        reject(new Error('Invalid response format from ML service.'));
      }
    });

    pythonProcess.on('error', (err) => {
        // This catches errors like 'spawn python ENOENT'
        console.error(`[ML Bridge] Failed to start Python process: ${err.message}`);
        reject(new Error(`ML Service Unavailable: ${err.message}. Check Python/library setup.`));
    });
  });
}