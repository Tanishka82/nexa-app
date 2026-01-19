"use client";

import { useState } from "react";
import { analyzeResumeFile } from "@/actions/resume";
import { Loader2, Upload, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResumeAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const result = await analyzeResumeFile(formData);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section (Matches Builder) */}
      <div className="space-y-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume AI Scanner
        </h1>
        <p className="text-muted-foreground">
          Upload your existing PDF resume to get an instant ATS score and
          actionable feedback.
        </p>
      </div>

      {/* Upload Section */}
      <div className="flex flex-col items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-primary/20 rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-background rounded-full shadow-sm mb-3">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="mb-2 text-sm text-foreground font-medium">
              <span className="font-semibold text-primary">Click to upload</span> or
              drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isAnalyzing}
          />
        </label>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            Analyzing your resume structure and content...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-8 animate-in fade-in-50 duration-500">
          
          {/* ATS Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1 border-primary/20 bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  ATS Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-bold ${
                      analysisResult.atsScore >= 70
                        ? "text-green-600"
                        : analysisResult.atsScore >= 50
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {analysisResult.atsScore}
                  </span>
                  <span className="text-muted-foreground">/100</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analysisResult.atsScore >= 70
                    ? "Excellent! Ready for applications."
                    : "Needs improvement to pass filters."}
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-3 border-primary/20 bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">
                  {analysisResult.summary}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Feedback */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Weaknesses */}
            <Card className="border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.weaknesses?.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-foreground flex items-start gap-2"
                    >
                      <span className="text-red-500 mt-1 min-w-[4px]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResult.suggestions?.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-foreground flex items-start gap-2"
                    >
                      <span className="text-green-500 mt-1 min-w-[4px]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}