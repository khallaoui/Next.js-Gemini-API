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
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

import { type Pensioner, type Operation, type Banking } from "@/lib/types";
import pensionersData from "@/data/pensioners.json";
import operationsData from "@/data/operations.json";
import bankingData from "@/data/banking.json";
import { useToast } from "@/hooks/use-toast";
import { generateRecordSummary } from "@/ai/flows/generate-record-summary";
import { format } from "date-fns";

export default function PensionerDetailClient({ id }: { id: string }) {
  const { toast } = useToast();
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = React.useState(false);

  const pensioner = pensionersData.find(
    (p) => p.SCPTE === parseInt(id)
  ) as Pensioner | undefined;

  const operations = operationsData.filter(
    (o) => o.FNDP === parseInt(id)
  ) as any[]; // Use any to access extra fields from json

  const banking = bankingData.find(
    (b) => b.ALLOC === parseInt(id)
  ) as any | undefined; // Use any to access extra fields from json


  React.useEffect(() => {
    if (!pensioner) {
      notFound();
    }
  }, [pensioner]);


  if (!pensioner) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-5 w-32 mt-2" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
             <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    );
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
      <div className="flex items-start justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">
              {pensioner.personalInfo.firstName} {pensioner.personalInfo.lastName}
            </h1>
            <p className="text-muted-foreground mt-1">Dossier No. {pensioner.SCPTE}</p>
        </div>
        <Button asChild variant="outline">
            <Link href="/pensioners">
                <ArrowLeft />
                Back to List
            </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Matricule</p>
                <p className="text-muted-foreground">{pensioner.matricule}</p>
              </div>
              <div>
                <p className="font-medium">CIN</p>
                <p className="text-muted-foreground">{pensioner.personalInfo.cin}</p>
              </div>
              <div>
                <p className="font-medium">Date of Birth</p>
                <p className="text-muted-foreground">
                  {format(new Date(pensioner.personalInfo.dateOfBirth), "PPP")}
                </p>
              </div>
              <div>
                <p className="font-medium">Gender</p>
                <p className="text-muted-foreground">
                  {pensioner.personalInfo.gender === "M" ? "Male" : "Female"}
                </p>
              </div>
              <div>
                <p className="font-medium">Family Situation</p>
                <p className="text-muted-foreground">{pensioner.personalInfo.familySituation}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">
                  {pensioner.personalInfo.address}
                </p>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText />
                Pension Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-medium">Pension Code</p>
                    <p className="text-muted-foreground">{pensioner.pensionCode}</p>
                </div>
                <div>
                    <p className="font-medium">Points</p>
                    <p className="text-muted-foreground">{pensioner.points}</p>
                </div>
                <div>
                    <p className="font-medium">Calculated Net</p>
                    <p className="text-muted-foreground">{pensioner.netCalculated.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</p>
                </div>
                 <div>
                    <p className="font-medium">Paid Net</p>
                    <p className="text-muted-foreground">{pensioner.netPaid.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</p>
                </div>
                 <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-muted-foreground">{pensioner.paymentMethod}</p>
                </div>
                <div>
                    <p className="font-medium">Status</p>
                    <p className="text-muted-foreground"><Badge>{pensioner.status}</Badge></p>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
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
                      {banking.VNOM1}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">IBAN</p>
                    <p className="text-muted-foreground font-mono text-xs break-all">{banking.VCPTE}</p>
                  </div>
                  <div>
                    <p className="font-medium">Bank Address</p>
                    <p className="text-muted-foreground">
                      {banking.VADR1}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  No banking information available for this pensioner.
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-primary"/>
                    AI Summary
                </div>
                <Button onClick={handleGenerateSummary} disabled={isLoadingSummary} size="sm">
                  {isLoadingSummary ? <Loader2 className="animate-spin" /> : 'Generate'}
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
              {summary && <div className="prose prose-sm dark:prose-invert text-foreground/90 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: summary }} />}
              {!summary && !isLoadingSummary && <p className="text-sm text-center text-muted-foreground py-4">Click 'Generate' to create a summary.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <History />
            Operations History
          </CardTitle>
           <CardDescription>
            A log of all financial transactions for this pensioner.
          </CardDescription>
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
                    const date = new Date(op.FAAREG, op.FMMREG - 1, op.FJJREG);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {format(date, "PPP")}
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
                        <TableCell className="font-mono text-xs">{op.FCHQBD || "N/A"}</TableCell>
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
