
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
  ArrowLeft,
  FileClock
} from "lucide-react";
import Link from "next/link";

import { 
  pensionerApi, 
  operationApi, 
  bankingApi, 
  demandeApi,
  type Pensioner, 
  type Operation, 
  type Demande, 
  type BankingInfo 
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { generateRecordSummary } from "@/ai/flows/generate-record-summary";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

export default function PensionerDetailClient({ id }: { id: string }) {
  const { toast } = useToast();
  const [pensioner, setPensioner] = React.useState<Pensioner | null>(null);
  const [operations, setOperations] = React.useState<Operation[]>([]);
  const [banking, setBanking] = React.useState<BankingInfo | null>(null);
  const [demandes, setDemandes] = React.useState<Demande[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = React.useState(false);

  React.useEffect(() => {
    async function fetchPensionerData() {
      try {
        setLoading(true);
        const pensionerId = parseInt(id);
        
        const [pensionerData, operationsData, demandesData] = await Promise.all([
          pensionerApi.getById(pensionerId),
          operationApi.getByPensionerId(pensionerId),
          demandeApi.getByPensionerId(pensionerId).catch(() => []), // Optional data
        ]);

        setPensioner(pensionerData);
        setOperations(operationsData);
        setDemandes(demandesData);

        // Try to fetch banking info (optional)
        try {
          const bankingData = await bankingApi.getByPensionerId(pensionerId);
          setBanking(bankingData);
        } catch (err) {
          // Banking info is optional
          setBanking(null);
        }

      } catch (err: any) {
        console.error("Error fetching pensioner data:", err);
        setError(err.message);
        if (err.message.includes('404')) {
          notFound();
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPensionerData();
  }, [id]);

  if (loading) {
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

  if (error || !pensioner) {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-semibold">Erreur lors du chargement du pensionnaire</h3>
          <p className="text-sm mt-1">{error || "Pensionnaire non trouvé"}</p>
        </div>
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
  
  const getPaymentMethodText = (code: string) => {
    switch (code) {
        case 'V': return 'Virement';
        case 'C': return 'Chèque';
        case 'P': return 'Prélèvement';
        default: return 'Inconnu';
    }
  }
  
  const getDemandeStatusVariant = (status: string) => {
    switch(status) {
      case 'Approuvée': return 'default';
      case 'Rejetée': return 'destructive';
      case 'En cours': return 'secondary';
      default: return 'outline';
    }
  }

  const getPaymentMethodDisplayText = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER': return 'Virement Bancaire';
      case 'CHECK': return 'Chèque';
      case 'CASH': return 'Espèces';
      case 'DIGITAL_WALLET': return 'Portefeuille Numérique';
      default: return method;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">
              {pensioner.name}
            </h1>
            <p className="text-muted-foreground mt-1">Dossier N° {pensioner.id}</p>
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
                <p className="font-medium">Nom Complet</p>
                <p className="text-muted-foreground">{pensioner.name}</p>
              </div>
              <div>
                <p className="font-medium">Ville</p>
                <p className="text-muted-foreground">{pensioner.city}</p>
              </div>
              {pensioner.birthDate && (
                <div>
                  <p className="font-medium">Date de Naissance</p>
                  <p className="text-muted-foreground">
                    {format(new Date(pensioner.birthDate), "PPP", { locale: fr })}
                  </p>
                </div>
              )}
              {pensioner.phoneNumber && (
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-muted-foreground">{pensioner.phoneNumber}</p>
                </div>
              )}
              {pensioner.lastPaymentDate && (
                <div className="col-span-2">
                  <p className="font-medium">Dernier Paiement</p>
                  <p className="text-muted-foreground">
                    {format(new Date(pensioner.lastPaymentDate), "PPP", { locale: fr })}
                  </p>
                </div>
              )}
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
                    <p className="font-medium">Paiement Mensuel</p>
                    <p className="text-muted-foreground">
                      {pensioner.monthlyPayment.toLocaleString("fr-MA", { 
                        style: "currency", 
                        currency: "MAD" 
                      })}
                    </p>
                </div>
                 <div>
                    <p className="font-medium">Mode de Paiement</p>
                    <p className="text-muted-foreground">{getPaymentMethodDisplayText(pensioner.paymentMethod)}</p>
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
              {banking && banking.accountNumber ? (
                <>
                  <div>
                    <p className="font-medium">Titulaire du Compte</p>
                    <p className="text-muted-foreground">
                      {banking.accountHolderName}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Numéro de Compte</p>
                    <p className="text-muted-foreground font-mono text-xs break-all">{banking.accountNumber}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresse de la Banque</p>
                    <p className="text-muted-foreground">
                      {banking.bankAddress}
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                    <TableHead>Mode</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {operations.length > 0 ? (
                    operations.map((op, index) => {
                        const getOperationTypeText = (type: string) => {
                          switch (type) {
                            case 'PAYMENT': return 'Paiement';
                            case 'BONUS': return 'Prime';
                            case 'ADJUSTMENT': return 'Ajustement';
                            case 'DEDUCTION': return 'Déduction';
                            default: return type;
                          }
                        };
                        
                        const getOperationVariant = (type: string) => {
                          return (type === 'PAYMENT' || type === 'BONUS') ? 'default' : 'destructive';
                        };

                        return (
                        <TableRow key={op.id || index}>
                            <TableCell>
                            {format(new Date(op.timestamp), "PPP", { locale: fr })}
                            </TableCell>
                            <TableCell>
                            <Badge variant={getOperationVariant(op.type)}>{getOperationTypeText(op.type)}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                            {op.amount.toLocaleString("fr-MA", {
                                style: "currency",
                                currency: "MAD",
                            })}
                            </TableCell>
                            <TableCell>{getPaymentMethodDisplayText(pensioner.paymentMethod)}</TableCell>
                        </TableRow>
                        );
                    })
                    ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            Aucune opération trouvée.
                        </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>>
            </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <FileClock />
                Historique des Demandes
            </CardTitle>
            <CardDescription>
                Un journal des demandes soumises par ce pensionnaire.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date Soumission</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Date Décision</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {demandes.length > 0 ? (
                                demandes.map((demande) => (
                                    <TableRow key={demande.id}>
                                        <TableCell>{format(new Date(demande.submissionDate), "PPP", { locale: fr })}</TableCell>
                                        <TableCell className="font-medium">{demande.type}</TableCell>
                                        <TableCell>
                                            <Badge variant={getDemandeStatusVariant(demande.status)}>{demande.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {demande.decisionDate ? format(new Date(demande.decisionDate), "PPP", { locale: fr }) : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Aucune demande trouvée.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
