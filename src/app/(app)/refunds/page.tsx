"use client";

import * as React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Undo2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { operationApi, pensionerApi, type Operation, type Pensioner } from "@/lib/api";
import ChatWindow from "@/components/ChatWindow";

interface RefundOperation extends Operation {
  pensioner?: Pensioner;
}

export default function RefundsPage() {
  const [refunds, setRefunds] = React.useState<RefundOperation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchRefunds() {
      try {
        setLoading(true);
        
        // Fetch all operations and pensioners
        const [operations, pensioners] = await Promise.all([
          operationApi.getAll(),
          pensionerApi.getAll()
        ]);

        // Filter for deduction operations (refunds/reimbursements)
        const refundOperations = operations
          .filter((op) => op.type === "DEDUCTION")
          .map((op) => {
            const pensioner = pensioners.find((p) => p.id === (op.pensioner?.id || op.pensionerId));
            return { ...op, pensioner };
          })
          .sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            return dateB.getTime() - dateA.getTime();
          });

        setRefunds(refundOperations);
      } catch (err: any) {
        console.error("Error fetching refunds:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRefunds();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
            <Undo2 className="h-8 w-8" />
            Consultation des Remboursés
          </h1>
          <p className="text-muted-foreground mt-1">
            Chargement des données de remboursement...
          </p>
        </header>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
            <Undo2 className="h-8 w-8" />
            Consultation des Remboursés
          </h1>
        </header>
        <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-semibold">Erreur lors du chargement des remboursements</h3>
          <p className="text-sm mt-1">{error}</p>
          <p className="text-xs mt-2 text-red-500">
            Assurez-vous que le backend Spring Boot fonctionne sur http://localhost:8080
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
          <Undo2 className="h-8 w-8" />
          Consultation des Remboursés
        </h1>
        <p className="text-muted-foreground mt-1">
          Consultez l'historique des personnes ayant bénéficié d'un remboursement.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Remboursements</CardTitle>
          <CardDescription>
            Liste de toutes les opérations de remboursement enregistrées.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bénéficiaire</TableHead>
                  <TableHead>N° Dossier</TableHead>
                  <TableHead>Date de Remboursement</TableHead>
                  <TableHead>Montant Remboursé</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refunds.length > 0 ? (
                  refunds.map((refund, index) => (
                    <TableRow key={refund.id || index}>
                      <TableCell className="font-medium">
                        {refund.pensioner?.name || "Pensionnaire inconnu"}
                      </TableCell>
                      <TableCell>{refund.pensioner?.id || refund.pensionerId}</TableCell>
                      <TableCell>
                        {format(new Date(refund.timestamp), "PPP", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="font-mono">
                          -{refund.amount.toLocaleString("fr-MA", {
                            style: "currency",
                            currency: "MAD",
                          })}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {refund.description || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {refund.pensioner && (
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/pensioners/${refund.pensioner.id || refund.pensionerId}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir Dossier
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Aucun remboursement trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Window */}
      <ChatWindow pensionData={JSON.stringify(refunds, null, 2)} />
    </div>
  );
}
