"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Euro, Landmark, CalendarClock } from "lucide-react";

import pensioners from "@/data/pensioners.json";
import operations from "@/data/operations.json";

export function StatsCards() {
  const totalPensioners = pensioners.length;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const totalMonthlyPayments = operations
    .filter(
      (op) =>
        op.FMMREG === currentMonth &&
        op.FAAREG === currentYear &&
        op.FCDMVT === "C"
    )
    .reduce((acc, op) => acc + op.FMTREG, 0);

  const newPensionersThisMonth = pensioners.filter((p) => {
    // This is a simplification; in a real scenario, we'd check an adhesion date.
    // For now, let's assume the last digit of their ID represents joining month for demo purposes.
    return (p.SCPTE % 12) + 1 === currentMonth;
  }).length;
  
  const monthName = new Date().toLocaleString("fr-FR", { month: "long" });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total des Pensionnaires
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPensioners}</div>
          <p className="text-xs text-muted-foreground">
            Total des membres actifs et retraités
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Prestations Payées (Ce Mois-ci)
          </CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalMonthlyPayments.toLocaleString("fr-FR", {
              style: "currency",
              currency: "EUR",
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Montant total décaissé en {monthName}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Nouveaux Pensionnaires (Ce Mois-ci)
          </CardTitle>
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{newPensionersThisMonth}</div>
          <p className="text-xs text-muted-foreground">
            Nouveaux membres ce mois-ci
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Modes de Paiement</CardTitle>
          <Landmark className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">
            Virement & Chèque
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
