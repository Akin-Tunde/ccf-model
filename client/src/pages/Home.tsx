import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { ArrowRight, Zap, BarChart3, Shield } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">CCF Model App</h1>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-slate-600">Welcome, {user?.name}</span>
                <Link href="/fraud-detection">
                  <Button>Go to App</Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button>Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            Credit Card Fraud Detection
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Test advanced machine learning models to detect fraudulent transactions in real-time.
            Compare model performance and make informed decisions.
          </p>
          <Link href="/fraud-detection">
            <Button size="lg" className="gap-2">
              Launch Application <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Real-Time Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Get instant fraud predictions with confidence scores for any transaction.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Model Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Compare performance metrics across Logistic Regression, Random Forest, and SVM models.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Optimized Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Models trained with 15 carefully selected features using Recursive Feature Elimination.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Model Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Best Performing Model</CardTitle>
              <CardDescription>Random Forest with RFE</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">F1-Score</span>
                  <span className="font-semibold">87.01%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "87.01%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">AUPRC</span>
                  <span className="font-semibold">88.46%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "88.46%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Precision</span>
                  <span className="font-semibold">97.47%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "97.47%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dataset & Training</CardTitle>
              <CardDescription>Model development details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Training Samples</p>
                <p className="text-lg font-semibold">227,845 transactions</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Test Samples</p>
                <p className="text-lg font-semibold">56,962 transactions</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Features Used</p>
                <p className="text-lg font-semibold">15 (RFE selected)</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Models Trained</p>
                <p className="text-lg font-semibold">3 classifiers</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to detect fraud?</h3>
          <p className="text-slate-600 mb-6">
            Start testing different models and analyzing transactions now.
          </p>
          <Link href="/fraud-detection">
            <Button size="lg">Open Fraud Detection Tool</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
