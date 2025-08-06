
"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
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
import { Loader2, Sparkles, FileText, BarChartBig, BrainCircuit, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { pensionerApi, operationApi } from "@/lib/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

export default function AnalysisPage() {
  const { toast } = useToast();
  const [pensionData, setPensionData] = React.useState("");
  const [analysisType, setAnalysisType] = React.useState("trend identification");
  const [reportFormat, setReportFormat] = React.useState("text");
  const [result, setResult] = React.useState<{ report: string; summary: string } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [dataLoading, setDataLoading] = React.useState(false);

  // Load initial sample data
  React.useEffect(() => {
    async function loadSampleData() {
      try {
        const pensioners = await pensionerApi.getAll();
        const sampleData = JSON.stringify(pensioners.slice(0, 5), null, 2);
        setPensionData(sampleData);
      } catch (error) {
        console.error("Error loading sample data:", error);
        setPensionData("[]");
      }
    }
    loadSampleData();
  }, []);

  const handleApplyDateFilter = async () => {
    setDataLoading(true);
    try {
      const [pensioners, operations] = await Promise.all([
        pensionerApi.getAll(),
        operationApi.getAll()
      ]);

      if (!dateRange?.from || !dateRange?.to) {
        setPensionData(JSON.stringify(pensioners, null, 2));
        toast({
          title: "Filtre réinitialisé",
          description: "Affichage de toutes les données des pensionnaires.",
        });
        return;
      }

      const filteredOperations = operations.filter(op => {
        const opDate = new Date(op.timestamp);
        return opDate >= dateRange.from! && opDate <= dateRange.to!;
      });
      
      const pensionerIdsWithOpsInDateRange = new Set(
        filteredOperations.map(op => op.pensioner?.id || op.pensionerId).filter(Boolean)
      );

      const filteredPensioners = pensioners.filter(p => 
        p.id && pensionerIdsWithOpsInDateRange.has(p.id)
      );
      
      const dataToAnalyze = filteredPensioners.map(p => ({
        ...p,
        operations: filteredOperations.filter(op => 
          (op.pensioner?.id || op.pensionerId) === p.id
        )
      }));

      setPensionData(JSON.stringify(dataToAnalyze, null, 2));
      toast({
        title: "Filtre appliqué",
        description: `Analyse des données pour ${dataToAnalyze.length} pensionnaires avec des opérations entre le ${format(dateRange.from, "PPP", { locale: fr })} et le ${format(dateRange.to, "PPP", { locale: fr })}.`,
      });
    } catch (error) {
      console.error("Error applying date filter:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données filtrées.",
      });
    } finally {
      setDataLoading(false);
    }
  };

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

      <Card>
        <CardHeader>
            <CardTitle>Recherche Avancée par Période</CardTitle>
            <CardDescription>
                Filtrez les opérations par date pour une analyse plus ciblée. Les données correspondantes seront chargées ci-dessous.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex items-end gap-4">
            <div className="grid gap-2">
                <Label htmlFor="date">Période des opérations</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className="w-[300px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y", { locale: fr })} -{" "}
                              {format(dateRange.to, "LLL dd, y", { locale: fr })}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y", { locale: fr })
                          )
                        ) : (
                          <span>Choisissez une période</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
            </div>
             <Button onClick={handleApplyDateFilter}><Filter /> Appliquer le Filtre</Button>
        </CardContent>
      </Card>


      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration de l'Analyse</CardTitle>
            <CardDescription>
              Saisissez vos données (ou générez-les avec la recherche avancée) et sélectionnez les paramètres.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pension-data">Données des Pensions (format JSON)</Label>
              <Textarea
                id="pension-data"
                placeholder="Collez vos données JSON ici ou utilisez la recherche avancée"
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
            <Button onClick={handleAnalyze} disabled={isLoading || !pensionData}>
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

    