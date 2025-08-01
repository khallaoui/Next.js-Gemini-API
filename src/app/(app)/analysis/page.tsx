"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { analyzePensionData } from "@/ai/flows/analyze-pension-data";
import { Loader2, Sparkles, FileText, BarChartBig, BrainCircuit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import pensionersData from "@/data/pensioners.json";

const sampleData = JSON.stringify(pensionersData.slice(0, 5), null, 2);

export default function AnalysisPage() {
  const { toast } = useToast();
  const [pensionData, setPensionData] = React.useState(sampleData);
  const [analysisType, setAnalysisType] = React.useState("trend identification");
  const [reportFormat, setReportFormat] = React.useState("text");
  const [result, setResult] = React.useState<{ report: string; summary: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await analyzePensionData({
        pensionData,
        analysisType,
        reportFormat,
      });
      setResult(response);
      toast({
        title: "Analysis Complete",
        description: "The pension data has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing the data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" />
            Data Analysis Tool
        </h1>
        <p className="text-muted-foreground mt-1">
          Use AI to analyze pension data, identify trends, and project future
          liabilities.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analysis Configuration</CardTitle>
            <CardDescription>
              Input your data and select the analysis parameters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pension-data">Pension Data (JSON format)</Label>
              <Textarea
                id="pension-data"
                placeholder="Paste your JSON data here"
                value={pensionData}
                onChange={(e) => setPensionData(e.target.value)}
                className="h-64 font-code text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="analysis-type">Analysis Type</Label>
                <Select
                  value={analysisType}
                  onValueChange={setAnalysisType}
                >
                  <SelectTrigger id="analysis-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trend identification">Trend ID</SelectItem>
                    <SelectItem value="data comparison">Comparison</SelectItem>
                    <SelectItem value="liability projection">Projection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-format">Report Format</Label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger id="report-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="JSON">JSON</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Analyze Data
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <BarChartBig />
                Analysis Results
            </CardTitle>
            <CardDescription>
              The generated report and summary will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && (
                <div className="space-y-6">
                    <div>
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                     <div>
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>
                </div>
            )}
            {result ? (
              <>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 font-headline"><Sparkles className="h-5 w-5 text-primary" />Summary</h3>
                  <div className="prose prose-sm dark:prose-invert text-muted-foreground whitespace-pre-wrap">{result.summary}</div>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 font-headline"><FileText className="h-5 w-5 text-primary" />Report</h3>
                  <pre className="text-xs bg-muted/50 p-4 rounded-md overflow-x-auto">
                    <code>{result.report}</code>
                  </pre>
                </div>
              </>
            ) : !isLoading && (
              <div className="flex items-center justify-center h-full min-h-[200px] rounded-lg border border-dashed">
                <p className="text-muted-foreground">Results will be shown here after analysis.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
