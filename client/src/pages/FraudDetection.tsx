import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ModelComparison } from "@/components/ModelComparison";

export default function FraudDetection() {
  const [selectedModel, setSelectedModel] = useState<string>("Random Forest");
  const [features, setFeatures] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Fetch available models, features, and metrics
  const { data: models, isLoading: modelsLoading } = trpc.fraud.getModels.useQuery();
  const { data: featureNames, isLoading: featuresLoading } = trpc.fraud.getFeatures.useQuery();
  const { data: metrics, isLoading: metricsLoading } = trpc.fraud.getMetrics.useQuery();

  // Prediction mutation
  const predictMutation = trpc.fraud.predict.useMutation();

  // Initialize features object
  useMemo(() => {
    if (featureNames && Object.keys(features).length === 0) {
      const initialFeatures: Record<string, number> = {};
      featureNames.forEach((name) => {
        initialFeatures[name] = 0;
      });
      setFeatures(initialFeatures);
    }
  }, [featureNames]);

  const handleFeatureChange = (featureName: string, value: string) => {
    setFeatures((prev) => ({
      ...prev,
      [featureName]: parseFloat(value) || 0,
    }));
  };

  const handlePredict = async () => {
    if (!selectedModel) return;

    try {
      await predictMutation.mutateAsync({
        modelName: selectedModel,
        features,
      });
      setShowResults(true);
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  const isLoading = modelsLoading || featuresLoading || metricsLoading;
  const result = predictMutation.data;
  const selectedMetrics = metrics?.[selectedModel];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Credit Card Fraud Detection
          </h1>
          <p className="text-lg text-slate-600">
            Test different machine learning models to detect fraudulent transactions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Analysis</CardTitle>
                <CardDescription>
                  Select a model and enter transaction features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Model Selection */}
                <div className="space-y-2">
                  <Label htmlFor="model-select" className="text-base font-semibold">
                    Select Model
                  </Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger id="model-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {models?.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Feature Inputs */}
                {featureNames && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {featureNames.map((featureName) => (
                        <div key={featureName} className="space-y-1">
                          <Label htmlFor={featureName} className="text-sm">
                            {featureName}
                          </Label>
                          <Input
                            id={featureName}
                            type="number"
                            placeholder="0"
                            value={features[featureName] || ""}
                            onChange={(e) =>
                              handleFeatureChange(featureName, e.target.value)
                            }
                            step="0.01"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Predict Button */}
                <Button
                  onClick={handlePredict}
                  disabled={predictMutation.isPending || isLoading}
                  className="w-full h-11 text-base font-semibold"
                >
                  {predictMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Check for Fraud"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Prediction Result */}
            {showResults && result && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Prediction Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`p-4 rounded-lg flex items-center gap-3 ${
                      result.prediction === "fraud"
                        ? "bg-red-50 border border-red-200"
                        : "bg-green-50 border border-green-200"
                    }`}
                  >
                    {result.prediction === "fraud" ? (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                    <div>
                      <p
                        className={`font-bold text-lg ${
                          result.prediction === "fraud"
                            ? "text-red-900"
                            : "text-green-900"
                        }`}
                      >
                        {result.prediction === "fraud" ? "FRAUD" : "LEGITIMATE"}
                      </p>
                      <p className="text-sm text-slate-600">
                        Confidence: {result.confidence}%
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-slate-600">
                      Model: <span className="font-semibold">{result.modelName}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Model Metrics */}
            {selectedMetrics && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Model Performance</CardTitle>
                  <CardDescription>{selectedModel}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">F1-Score</span>
                      <span className="font-semibold">
                        {(selectedMetrics.f1_score * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${selectedMetrics.f1_score * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">AUPRC</span>
                      <span className="font-semibold">
                        {(selectedMetrics.auprc * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${selectedMetrics.auprc * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Precision</span>
                      <span className="font-semibold">
                        {(selectedMetrics.precision * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${selectedMetrics.precision * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Recall</span>
                      <span className="font-semibold">
                        {(selectedMetrics.recall * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${selectedMetrics.recall * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Visualizations Section */}
        <div className="mt-8">
          <ModelComparison metrics={metrics} />
        </div>

        {/* Model Comparison Table Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
              <CardDescription>
                Performance metrics across all available models
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metrics && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-semibold">Model</th>
                        <th className="text-right py-2 px-4 font-semibold">F1-Score</th>
                        <th className="text-right py-2 px-4 font-semibold">AUPRC</th>
                        <th className="text-right py-2 px-4 font-semibold">Precision</th>
                        <th className="text-right py-2 px-4 font-semibold">Recall</th>
                        <th className="text-right py-2 px-4 font-semibold">AUC-ROC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(metrics).map(([modelName, modelMetrics]) => (
                        <tr
                          key={modelName}
                          className={`border-b hover:bg-slate-50 ${
                            modelName === selectedModel ? "bg-blue-50" : ""
                          }`}
                        >
                          <td className="py-3 px-4 font-medium">{modelName}</td>
                          <td className="text-right py-3 px-4">
                            {(modelMetrics.f1_score * 100).toFixed(2)}%
                          </td>
                          <td className="text-right py-3 px-4">
                            {(modelMetrics.auprc * 100).toFixed(2)}%
                          </td>
                          <td className="text-right py-3 px-4">
                            {(modelMetrics.precision * 100).toFixed(2)}%
                          </td>
                          <td className="text-right py-3 px-4">
                            {(modelMetrics.recall * 100).toFixed(2)}%
                          </td>
                          <td className="text-right py-3 px-4">
                            {(modelMetrics.auc_roc * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
