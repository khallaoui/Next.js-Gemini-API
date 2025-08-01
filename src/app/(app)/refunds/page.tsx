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

import operationsData from "@/data/operations.json";
import pensionersData from "@/data/pensioners.json";
import { type Pensioner, type Operation } from "@/lib/types";

interface RefundOperation extends Operation {
  pensioner?: Pensioner;
}

export default function RefundsPage() {
  const [refunds, setRefunds] = React.useState<RefundOperation[]>([]);

  React.useEffect(() => {
    // Filter for "Débit" operations, which represent reimbursements from the fund's perspective.
    const refundOperations = operationsData
      .filter((op) => op.FCDMVT === "D")
      .map((op) => {
        const pensioner = pensionersData.find((p) => p.SCPTE === op.FNDP);
        return { ...op, pensioner };
      })
      .sort((a, b) => {
        const dateA = new Date(a.FAAREG, a.FMMREG - 1, a.FJJREG);
        const dateB = new Date(b.FAAREG, b.FMMREG - 1, b.FJJREG);
        return dateB.getTime() - dateA.getTime();
      });
    setRefunds(refundOperations);
  }, []);
  
  const getPensionerName = (pensioner?: Pensioner) => {
      if (!pensioner) return "Pensionnaire inconnu";
      return `${pensioner.personalInfo.firstName} ${pensioner.personalInfo.lastName}`;
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
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {getPensionerName(refund.pensioner)}
                      </TableCell>
                       <TableCell>{refund.FNDP}</TableCell>
                      <TableCell>
                        {format(new Date(refund.FAAREG, refund.FMMREG - 1, refund.FJJREG), "PPP", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {refund.FMTREG.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{refund.FCHQBD}</TableCell>
                      <TableCell className="text-right">
                        {refund.pensioner && (
                             <Button asChild variant="ghost" size="sm">
                                <Link href={`/pensioners/${refund.FNDP}`}>
                                    <Eye className="mr-2" />
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
    </div>
  );
}
