import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ModelMetrics {
  f1_score: number;
  precision: number;
  recall: number;
  auc_roc: number;
  auprc: number;
}

interface ModelComparisonProps {
  metrics: Record<string, ModelMetrics> | undefined;
}

export function ModelComparison({ metrics }: ModelComparisonProps) {
  // Prepare data for F1-Score comparison
  const f1ComparisonData = useMemo(() => {
    if (!metrics) return [];
    return Object.entries(metrics).map(([modelName, modelMetrics]) => ({
      name: modelName,
      "F1-Score": Math.round(modelMetrics.f1_score * 100),
    }));
  }, [metrics]);

  // Prepare data for AUPRC comparison
  const auprcComparisonData = useMemo(() => {
    if (!metrics) return [];
    return Object.entries(metrics).map(([modelName, modelMetrics]) => ({
      name: modelName,
      AUPRC: Math.round(modelMetrics.auprc * 100),
    }));
  }, [metrics]);

  // Prepare data for detailed metrics comparison
  const detailedMetricsData = useMemo(() => {
    if (!metrics) return [];
    return Object.entries(metrics).map(([modelName, modelMetrics]) => ({
      name: modelName,
      Precision: Math.round(modelMetrics.precision * 100),
      Recall: Math.round(modelMetrics.recall * 100),
      "F1-Score": Math.round(modelMetrics.f1_score * 100),
      "AUC-ROC": Math.round(modelMetrics.auc_roc * 100),
    }));
  }, [metrics]);

  // Prepare data for precision-recall tradeoff
  const precisionRecallData = useMemo(() => {
    if (!metrics) return [];
    return Object.entries(metrics).map(([modelName, modelMetrics]) => ({
      name: modelName,
      Precision: Math.round(modelMetrics.precision * 100),
      Recall: Math.round(modelMetrics.recall * 100),
    }));
  }, [metrics]);

  if (!metrics) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* F1-Score Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>F1-Score Comparison</CardTitle>
          <CardDescription>
            Harmonic mean of precision and recall across models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={f1ComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="F1-Score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AUPRC Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>AUPRC Comparison</CardTitle>
          <CardDescription>
            Area Under the Precision-Recall Curve for imbalanced classification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={auprcComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="AUPRC" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Metrics Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics Comparison</CardTitle>
          <CardDescription>
            All performance metrics across models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={detailedMetricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="Precision" fill="#10b981" />
              <Bar dataKey="Recall" fill="#f59e0b" />
              <Bar dataKey="F1-Score" fill="#3b82f6" />
              <Bar dataKey="AUC-ROC" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Precision-Recall Tradeoff */}
      <Card>
        <CardHeader>
          <CardTitle>Precision-Recall Tradeoff</CardTitle>
          <CardDescription>
            Balance between false positives and false negatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={precisionRecallData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Precision"
                stroke="#10b981"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Recall"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
