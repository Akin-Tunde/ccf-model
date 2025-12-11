import { describe, expect, it } from "vitest";
import {
  getAvailableModels,
  getFeatureNames,
  getModelMetrics,
  predictFraud,
  PredictionInput,
} from "./ml";

describe("Fraud Detection ML Module", () => {
  describe("getAvailableModels", () => {
    it("should return all three models", () => {
      const models = getAvailableModels();
      expect(models).toHaveLength(3);
      expect(models).toContain("Logistic Regression");
      expect(models).toContain("Random Forest");
      expect(models).toContain("Support Vector Machine");
    });
  });

  describe("getFeatureNames", () => {
    it("should return exactly 15 features", () => {
      const features = getFeatureNames();
      expect(features).toHaveLength(15);
    });

    it("should include required features", () => {
      const features = getFeatureNames();
      expect(features).toContain("Time");
      expect(features).toContain("Amount");
      expect(features).toContain("V1");
      expect(features).toContain("V4");
      expect(features).toContain("V28");
    });

    it("should have correct feature order", () => {
      const features = getFeatureNames();
      expect(features[0]).toBe("Time");
      expect(features[1]).toBe("V1");
      expect(features[14]).toBe("Amount");
    });
  });

  describe("getModelMetrics", () => {
    it("should return metrics for all models", () => {
      const metrics = getModelMetrics();
      expect(Object.keys(metrics)).toHaveLength(3);
      expect(metrics["Logistic Regression"]).toBeDefined();
      expect(metrics["Random Forest"]).toBeDefined();
      expect(metrics["Support Vector Machine"]).toBeDefined();
    });

    it("should have valid metric values for each model", () => {
      const metrics = getModelMetrics();
      Object.entries(metrics).forEach(([modelName, modelMetrics]) => {
        expect(modelMetrics.f1_score).toBeGreaterThanOrEqual(0);
        expect(modelMetrics.f1_score).toBeLessThanOrEqual(1);
        expect(modelMetrics.precision).toBeGreaterThanOrEqual(0);
        expect(modelMetrics.precision).toBeLessThanOrEqual(1);
        expect(modelMetrics.recall).toBeGreaterThanOrEqual(0);
        expect(modelMetrics.recall).toBeLessThanOrEqual(1);
        expect(modelMetrics.auc_roc).toBeGreaterThanOrEqual(0);
        expect(modelMetrics.auc_roc).toBeLessThanOrEqual(1);
        expect(modelMetrics.auprc).toBeGreaterThanOrEqual(0);
        expect(modelMetrics.auprc).toBeLessThanOrEqual(1);
      });
    });

    it("Random Forest should have the highest F1-Score", () => {
      const metrics = getModelMetrics();
      const rfF1 = metrics["Random Forest"].f1_score;
      const lrF1 = metrics["Logistic Regression"].f1_score;
      const svmF1 = metrics["Support Vector Machine"].f1_score;

      expect(rfF1).toBeGreaterThan(lrF1);
      expect(rfF1).toBeGreaterThan(svmF1);
    });

    it("Random Forest should have the highest AUPRC", () => {
      const metrics = getModelMetrics();
      const rfAUPRC = metrics["Random Forest"].auprc;
      const lrAUPRC = metrics["Logistic Regression"].auprc;
      const svmAUPRC = metrics["Support Vector Machine"].auprc;

      expect(rfAUPRC).toBeGreaterThan(lrAUPRC);
      expect(rfAUPRC).toBeGreaterThan(svmAUPRC);
    });
  });

  describe("predictFraud", () => {
    const testFeatures: PredictionInput = {
      Time: 0,
      V1: 0,
      V4: 0,
      V5: 0,
      V8: 0,
      V10: 0,
      V12: 0,
      V13: 0,
      V14: 0,
      V16: 0,
      V17: 0,
      V20: 0,
      V22: 0,
      V28: 0,
      Amount: 100,
    };

    it("should return a valid prediction for Random Forest", () => {
      const result = predictFraud("Random Forest", testFeatures);
      expect(result.prediction).toMatch(/^(fraud|legitimate)$/);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(result.modelName).toBe("Random Forest");
    });

    it("should return a valid prediction for Logistic Regression", () => {
      const result = predictFraud("Logistic Regression", testFeatures);
      expect(result.prediction).toMatch(/^(fraud|legitimate)$/);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(result.modelName).toBe("Logistic Regression");
    });

    it("should return a valid prediction for SVM", () => {
      const result = predictFraud("Support Vector Machine", testFeatures);
      expect(result.prediction).toMatch(/^(fraud|legitimate)$/);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
      expect(result.modelName).toBe("Support Vector Machine");
    });

    it("should throw error for unknown model", () => {
      expect(() => {
        predictFraud("Unknown Model", testFeatures);
      }).toThrow();
    });

    it("should handle high amount transactions", () => {
      const highAmountFeatures: PredictionInput = {
        ...testFeatures,
        Amount: 5000,
      };
      const result = predictFraud("Random Forest", highAmountFeatures);
      expect(result).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it("should handle extreme feature values", () => {
      const extremeFeatures: PredictionInput = {
        ...testFeatures,
        V1: 10,
        V4: -10,
        Amount: 0.01,
      };
      const result = predictFraud("Random Forest", extremeFeatures);
      expect(result).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it("should be consistent across multiple calls with same input", () => {
      const result1 = predictFraud("Random Forest", testFeatures);
      const result2 = predictFraud("Random Forest", testFeatures);
      expect(result1.prediction).toBe(result2.prediction);
      expect(result1.confidence).toBe(result2.confidence);
    });

    it("should produce different predictions for different models", () => {
      const features: PredictionInput = {
        ...testFeatures,
        Amount: 1500,
        V1: 2.5,
      };
      const rfResult = predictFraud("Random Forest", features);
      const lrResult = predictFraud("Logistic Regression", features);

      // At least one should be different (may not always be true, but likely)
      expect(
        rfResult.prediction !== lrResult.prediction ||
          rfResult.confidence !== lrResult.confidence
      ).toBeTruthy();
    });
  });
});
