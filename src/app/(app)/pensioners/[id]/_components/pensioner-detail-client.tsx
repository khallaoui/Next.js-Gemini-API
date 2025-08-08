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
  FileClock,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import {
  pensionerApi,
  operationApi,
  bankingApi,
  demandeApi,
  type Pensioner,
  type Operation,
  type Demande,
  type BankingInfo,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { generateRecordSummary } from "@/ai/flows/generate-record-summary";

// Utility functions
const validatePensionerData = (data: unknown): Pensioner => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid pensioner data structure");
  }

  const pensioner = data as Pensioner;
  if (!pensioner.id || !pensioner.name || !pensioner.city) {
    throw new Error("Missing required pensioner fields");
  }

  return pensioner;
};

const normalizeOperations = (ops: unknown): Operation[] => {
  if (!Array.isArray(ops)) {
    console.warn("Operations data is not an array");
    return [];
  }

  return ops.map((op) => ({
    ...op,
    timestamp: op.timestamp || new Date().toISOString(),
    amount: op.amount || 0,
    type: op.type || "UNKNOWN",
  }));
};

const normalizeDemandes = (demandes: unknown): Demande[] => {
  if (!Array.isArray(demandes)) {
    console.warn("Demandes data is not an array");
    return [];
  }

  return demandes.map((d) => ({
    ...d,
    submissionDate: d.submissionDate || new Date().toISOString(),
    decisionDate: d.decisionDate || null,
    status: d.status || "PENDING",
  }));
};

const getOperationTypeText = (type: string) => {
  switch (type) {
    case "PAYMENT":
      return "Paiement";
    case "BONUS":
      return "Prime";
    case "ADJUSTMENT":
      return "Ajustement";
    case "DEDUCTION":
      return "Déduction";
    default:
      return type;
  }
};

const getOperationVariant = (type: string) => {
  return type === "PAYMENT" || type === "BONUS" ? "default" : "destructive";
};

const getPaymentMethodDisplayText = (method: string) => {
  switch (method) {
    case "BANK_TRANSFER":
      return "Virement Bancaire";
    case "CHECK":
      return "Chèque";
    case "CASH":
      return "Espèces";
    case "DIGITAL_WALLET":
      return "Portefeuille Numérique";
    default:
      return method;
  }
};

const getDemandeStatusVariant = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "default";
    case "REJECTED":
      return "destructive";
    case "PENDING":
      return "secondary";
    default:
      return "outline";
  }
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "PPP", { locale: fr });
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("fr-MA", {
    style: "currency",
    currency: "MAD",
  });
};

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
    const fetchPensionerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const pensionerId = parseInt(id);
        if (isNaN(pensionerId)) {
          throw new Error("Invalid pensioner ID");
        }

        const [pensionerData, operationsData, demandesData] = await Promise.all([
          pensionerApi
            .getById(pensionerId)
            .then(validatePensionerData)
            .catch((err) => {
              console.error("Error fetching pensioner:", err);
              throw new Error("Failed to load pensioner details");
            }),
          operationApi
            .getByPensionerId(pensionerId)
            .then(normalizeOperations)
            .catch((err) => {
              console.error("Error fetching operations:", err);
              return [];
            }),
          demandeApi
            .getByPensionerId(pensionerId)
            .then(normalizeDemandes)
            .catch((err) => {
              console.error("Error fetching demandes:", err);
              return [];
            }),
        ]);

        setPensioner(pensionerData);
        setOperations(operationsData);
        setDemandes(demandesData);

        try {
          const bankingData = await bankingApi.getByPensionerId(pensionerId);
          if (bankingData && typeof bankingData === "object") {
            setBanking(bankingData);
          }
        } catch (err) {
          console.log("No banking info available");
        }
      } catch (err: any) {
        console.error("Error in fetchPensionerData:", err);
        setError(err.message);

        if (err.message.includes("404") || err.message.includes("not found")) {
          notFound();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPensionerData();
  }, [id]);

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    setSummary(null);
    try {
      if (!pensioner) {
        throw new Error("No pensioner data available");
      }

      const pensionerRecord = JSON.stringify(
        { pensioner, operations, banking },
        null,
        2
      );
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
        description:
          "Échec de la génération du résumé IA. Veuillez réessayer.",
      });
    } finally {
      setIsLoadingSummary(false);
    }
  };

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
          <p className="text-xs mt-2">ID: {id}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/pensioners">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">{pensioner.name}</h1>
          <p className="text-muted-foreground mt-1">Dossier N° {pensioner.id}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/pensioners">
            <ArrowLeft className="mr-2 h-4 w-4" />
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
                    {formatDate(pensioner.birthDate)}
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
                    {formatDate(pensioner.lastPaymentDate)}
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
                  {formatCurrency(pensioner.monthlyPayment)}
                </p>
              </div>
              <div>
                <p className="font-medium">Mode de Paiement</p>
                <p className="text-muted-foreground">
                  {getPaymentMethodDisplayText(pensioner.paymentMethod)}
                </p>
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
              {banking?.accountNumber ? (
                <>
                  <div>
                    <p className="font-medium">Titulaire du Compte</p>
                    <p className="text-muted-foreground">
                      {banking.accountHolderName}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Numéro de Compte</p>
                    <p className="text-muted-foreground font-mono text-xs break-all">
                      {banking.accountNumber}
                    </p>
                  </div>
                  {banking.bankAddress && (
                    <div>
                      <p className="font-medium">Adresse de la Banque</p>
                      <p className="text-muted-foreground">{banking.bankAddress}</p>
                    </div>
                  )}
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
                  <Sparkles className="text-primary" />
                  Résumé IA
                </div>
                <Button
                  onClick={handleGenerateSummary}
                  disabled={isLoadingSummary}
                  size="sm"
                >
                  {isLoadingSummary ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Générer"
                  )}
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
              {summary && (
                <div
                  className="prose prose-sm dark:prose-invert text-foreground/90 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: summary }}
                />
              )}
              {!summary && !isLoadingSummary && (
                <p className="text-sm text-center text-muted-foreground py-4">
                  Cliquez sur 'Générer' pour créer un résumé.
                </p>
              )}
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
                    operations.map((op) => (
                      <TableRow key={op.id}>
                        <TableCell>{formatDate(op.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant={getOperationVariant(op.type)}>
                            {getOperationTypeText(op.type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(op.amount)}
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodDisplayText(pensioner.paymentMethod)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Aucune opération trouvée.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
                        <TableCell>{formatDate(demande.submissionDate)}</TableCell>
                        <TableCell className="font-medium">
                          {demande.type}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getDemandeStatusVariant(demande.status)}>
                            {demande.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {demande.decisionDate
                            ? formatDate(demande.decisionDate)
                            : "N/A"}
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