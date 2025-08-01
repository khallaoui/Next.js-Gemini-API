"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Landmark,
  History,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";

import { type Pensioner, type Operation, type Banking } from "@/lib/types";
import pensionersData from "@/data/pensioners.json";
import operationsData from "@/data/operations.json";
import bankingData from "@/data/banking.json";
import { useToast } from "@/hooks/use-toast";
import { generateRecordSummary } from "@/ai/flows/generate-record-summary";

export default function PensionerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { toast } = useToast();
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = React.useState(false);

  const pensioner = pensionersData.find(
    (p) => p.SCPTE === parseInt(params.id)
  ) as Pensioner | undefined;
  const operations = operationsData.filter(
    (o) => o.FNDP === parseInt(params.id)
  ) as Operation[];
  const banking = bankingData.find(
    (b) => b.ALLOC === parseInt(params.id)
  ) as Banking | undefined;

  if (!pensioner) {
    notFound();
  }

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    setSummary(null);
    try {
      const pensionerRecord = JSON.stringify({ pensioner, operations, banking }, null, 2);
      const result = await generateRecordSummary({ pensionerRecord });
      setSummary(result.summary);
      toast({
        title: "Summary Generated",
        description: "AI-powered summary has been successfully created.",
      });
    } catch (error) {
      console.error("Failed to generate summary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate AI summary. Please try again.",
      });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const getOperationTypeVariant = (type: string) => {
    return type === "Crédit" ? "default" : "destructive";
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">
          {pensioner.NOM1} {pensioner.NOM2}
        </h1>
        <p className="text-muted-foreground">Dossier No. {pensioner.SCPTE}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Matricule</p>
                <p className="text-muted-foreground">{pensioner.MATRIC}</p>
              </div>
              <div>
                <p className="font-medium">CIN</p>
                <p className="text-muted-foreground">{pensioner.CIN}</p>
              </div>
              <div>
                <p className="font-medium">Date of Birth</p>
                <p className="text-muted-foreground">
                  {pensioner.JJNSP}/{pensioner.MMNSP}/{pensioner.AANSP}
                </p>
              </div>
              <div>
                <p className="font-medium">Gender</p>
                <p className="text-muted-foreground">
                  {pensioner.SEXE === "M" ? "Male" : "Female"}
                </p>
              </div>
              <div>
                <p className="font-medium">Family Situation</p>
                <p className="text-muted-foreground">{pensioner.SITFAM}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">
                  {pensioner.ADRESA}, {pensioner.ADRESB} {pensioner.CODVIL}{" "}
                  {pensioner.VILLE}, {pensioner.PAYS}
                </p>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText />
                Pension Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-medium">Pension Code</p>
                    <p className="text-muted-foreground">{pensioner.CODPEN}</p>
                </div>
                <div>
                    <p className="font-medium">Points</p>
                    <p className="text-muted-foreground">{pensioner.PTS}</p>
                </div>
                <div>
                    <p className="font-medium">Calculated Net</p>
                    <p className="text-muted-foreground">{pensioner.NETCAL.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</p>
                </div>
                 <div>
                    <p className="font-medium">Paid Net</p>
                    <p className="text-muted-foreground">{pensioner.NETRGT.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</p>
                </div>
                 <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-muted-foreground">{pensioner.MODREG}</p>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark />
                Banking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {banking && banking.VCPTE ? (
                <>
                  <div>
                    <p className="font-medium">Account Holder</p>
                    <p className="text-muted-foreground">
                      {banking.VNOM1} {banking.VNOM2}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">IBAN</p>
                    <p className="text-muted-foreground font-mono text-xs break-all">{banking.VCPTE}</p>
                  </div>
                  <div>
                    <p className="font-medium">Bank Address</p>
                    <p className="text-muted-foreground">
                      {banking.VADR1}, {banking.VADR2}, {banking.VADR3},{" "}
                      {banking.VVILL}, {banking.VPAYS}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  No banking information available. Payment by check.
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-primary"/>
                    AI Summary
                </div>
                <Button onClick={handleGenerateSummary} disabled={isLoadingSummary} size="sm">
                  {isLoadingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate'}
                </Button>
              </CardTitle>
              <CardDescription>
                AI-generated insights on this pensioner's record.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSummary && (
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
              )}
              {summary && <p className="text-sm text-foreground/80">{summary}</p>}
              {!summary && !isLoadingSummary && <p className="text-sm text-muted-foreground">Click 'Generate' to create a summary.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History />
            Operations History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.length > 0 ? (
                  operations.map((op, index) => {
                    const type = op.FCDMVT === "C" ? "Crédit" : "Débit";
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {op.FJJREG}/{op.FMMREG}/{op.FAAREG}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getOperationTypeVariant(type)}>{type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {op.FMTREG.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </TableCell>
                        <TableCell>{op.FMDREG}</TableCell>
                        <TableCell>{op.FCHQBD}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                   <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No operations found.
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
