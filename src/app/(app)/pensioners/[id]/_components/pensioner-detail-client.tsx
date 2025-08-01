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

import { type Pensioner } from "@/lib/types";
import pensionersData from "@/data/pensioners.json";
import operationsData from "@/data/operations.json";
import bankingData from "@/data/banking.json";
import { useToast } from "@/hooks/use-toast";
import { generateRecordSummary } from "@/ai/flows/generate-record-summary";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

export default function PensionerDetailClient({ id }: { id: string }) {
  const { toast } = useToast();
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = React.useState(false);

  const pensioner = pensionersData.find(
    (p) => p.SCPTE === parseInt(id)
  ) as Pensioner | undefined;

  const operations = operationsData.filter(
    (o) => o.FNDP === parseInt(id)
  );

  const banking = bankingData.find(
    (b) => b.ALLOC === parseInt(id)
  );


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
        title: "Résumé généré",
        description: "Le résumé par l'IA a été créé avec succès.",
      });
    } catch (error) {
      console.error("Failed to generate summary:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de la génération du résumé IA. Veuillez réessayer.",
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
            <p className="text-muted-foreground mt-1">Dossier N° {pensioner.SCPTE}</p>
        </div>
        <Button asChild variant="outline">
            <Link href="/pensioners">
                <ArrowLeft />
                Retour à la liste
            </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User />
                Informations Personnelles
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
                <p className="font-medium">Date de Naissance</p>
                <p className="text-muted-foreground">
                  {format(new Date(pensioner.personalInfo.dateOfBirth), "PPP", { locale: fr })}
                </p>
              </div>
              <div>
                <p className="font-medium">Sexe</p>
                <p className="text-muted-foreground">
                  {pensioner.personalInfo.gender === "M" ? "Masculin" : "Féminin"}
                </p>
              </div>
              <div>
                <p className="font-medium">Situation Familiale</p>
                <p className="text-muted-foreground">{pensioner.personalInfo.familySituation}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Adresse</p>
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
                Détails de la Pension
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-medium">Code Pension</p>
                    <p className="text-muted-foreground">{pensioner.pensionCode}</p>
                </div>
                <div>
                    <p className="font-medium">Points</p>
                    <p className="text-muted-foreground">{pensioner.points}</p>
                </div>
                <div>
                    <p className="font-medium">Net Calculé</p>
                    <p className="text-muted-foreground">{pensioner.netCalculated.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</p>
                </div>
                 <div>
                    <p className="font-medium">Net Payé</p>
                    <p className="text-muted-foreground">{pensioner.netPaid.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</p>
                </div>
                 <div>
                    <p className="font-medium">Mode de Paiement</p>
                    <p className="text-muted-foreground">{pensioner.paymentMethod}</p>
                </div>
                <div>
                    <p className="font-medium">Statut</p>
                    <div className="text-muted-foreground"><Badge>{pensioner.status}</Badge></div>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Landmark />
                Informations Bancaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {banking && banking.VCPTE ? (
                <>
                  <div>
                    <p className="font-medium">Titulaire du Compte</p>
                    <p className="text-muted-foreground">
                      {banking.VNOM1}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">IBAN</p>
                    <p className="text-muted-foreground font-mono text-xs break-all">{banking.VCPTE}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresse de la Banque</p>
                    <p className="text-muted-foreground">
                      {banking.VADR1}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Aucune information bancaire disponible.
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-primary"/>
                    Résumé IA
                </div>
                <Button onClick={handleGenerateSummary} disabled={isLoadingSummary} size="sm">
                  {isLoadingSummary ? <Loader2 className="animate-spin" /> : 'Générer'}
                </Button>
              </CardTitle>
              <CardDescription>
                Aperçu généré par l'IA sur ce dossier.
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
              {!summary && !isLoadingSummary && <p className="text-sm text-center text-muted-foreground py-4">Cliquez sur 'Générer' pour créer un résumé.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <History />
            Historique des Opérations
          </CardTitle>
           <CardDescription>
            Un journal de toutes les transactions financières pour ce pensionnaire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Mode de Paiement</TableHead>
                  <TableHead>Référence</TableHead>
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
                          {format(date, "PPP", { locale: fr })}
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
                        Aucune opération trouvée.
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
