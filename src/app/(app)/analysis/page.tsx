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
        title: "Analyse terminée",
        description: "Les données des pensions ont été analysées avec succès.",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Échec de l'analyse",
        description: "Une erreur s'est produite lors de l'analyse des données.",
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
            Outil d'Analyse de Données
        </h1>
        <p className="text-muted-foreground mt-1">
          Utilisez l'IA pour analyser les données des pensions, identifier les tendances et projeter les engagements futurs.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration de l'Analyse</CardTitle>
            <CardDescription>
              Saisissez vos données et sélectionnez les paramètres d'analyse.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pension-data">Données des Pensions (format JSON)</Label>
              <Textarea
                id="pension-data"
                placeholder="Collez vos données JSON ici"
                value={pensionData}
                onChange={(e) => setPensionData(e.target.value)}
                className="h-64 font-code text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="analysis-type">Type d'Analyse</Label>
                <Select
                  value={analysisType}
                  onValueChange={setAnalysisType}
                >
                  <SelectTrigger id="analysis-type">
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trend identification">Identification de tendance</SelectItem>
                    <SelectItem value="data comparison">Comparaison de données</SelectItem>
                    <SelectItem value="liability projection">Projection des engagements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-format">Format du Rapport</Label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger id="report-format">
                    <SelectValue placeholder="Sélectionnez le format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texte</SelectItem>
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
              Analyser les Données
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <BarChartBig />
                Résultats de l'Analyse
            </CardTitle>
            <CardDescription>
              Le rapport et le résumé générés apparaîtront ici.
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
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 font-headline"><Sparkles className="h-5 w-5 text-primary" />Résumé</h3>
                  <div className="prose prose-sm dark:prose-invert text-muted-foreground whitespace-pre-wrap">{result.summary}</div>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 font-headline"><FileText className="h-5 w-5 text-primary" />Rapport</h3>
                  <pre className="text-xs bg-muted/50 p-4 rounded-md overflow-x-auto">
                    <code>{result.report}</code>
                  </pre>
                </div>
              </>
            ) : !isLoading && (
              <div className="flex items-center justify-center h-full min-h-[200px] rounded-lg border border-dashed">
                <p className="text-muted-foreground">Les résultats s'afficheront ici après l'analyse.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
