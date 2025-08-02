
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserCog, Undo2 } from "lucide-react";

import pensioners from "@/data/pensioners.json";
import operations from "@/data/operations.json";

export function StatsCards() {
  const totalPensioners = pensioners.length;
  
  const activeAffiliates = pensioners.filter(p => p.status === "ACTIF").length;
  
  // For this simulation, allocataires are all pensioners.
  const totalAllocataires = pensioners.length;

  const refundedCount = new Set(operations.filter(op => op.FCDMVT === "D").map(op => op.FNDP)).size;


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total des Adhérents
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPensioners}</div>
          <p className="text-xs text-muted-foreground">
            Tous les membres (actifs et inactifs)
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Affiliés Actifs
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {activeAffiliates}
          </div>
          <p className="text-xs text-muted-foreground">
            Membres qui cotisent actuellement
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total des Allocataires
          </CardTitle>
          <UserCog className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAllocataires}</div>
           <p className="text-xs text-muted-foreground">
            Personnes bénéficiant d'une allocation
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des Remboursés</CardTitle>
          <Undo2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{refundedCount}</div>
          <p className="text-xs text-muted-foreground">
            Personnes ayant eu un remboursement
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
