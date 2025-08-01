"use client";

import operationsData from "@/data/operations.json";
import pensionersData from "@/data/pensioners.json";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export function RecentActivity() {
  // Sort operations by date in descending order and take the first 5
  const recentOperations = operationsData
    .sort((a, b) => {
      const dateA = new Date(a.FAAREG, a.FMMREG - 1, a.FJJREG);
      const dateB = new Date(b.FAAREG, b.FMMREG - 1, b.FJJREG);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  const getPensionerInitials = (pensionerId: number) => {
    const pensioner = pensionersData.find((p) => p.SCPTE === pensionerId);
    if (!pensioner) return "??";
    const [firstName, lastName] = [pensioner.NOM2, pensioner.NOM1];
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  };
  
  const getPensionerName = (pensionerId: number) => {
    const pensioner = pensionersData.find((p) => p.SCPTE === pensionerId);
    if (!pensioner) return "Unknown Pensioner";
    return `${pensioner.NOM2} ${pensioner.NOM1}`;
  }

  return (
    <div className="space-y-4">
      {recentOperations.length > 0 ? (
        recentOperations.map((op, index) => (
          <div key={index} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{getPensionerInitials(op.FNDP)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1 text-sm">
                <p className="font-medium leading-none">
                    <Link href={`/pensioners/${op.FNDP}`} className="hover:underline">
                        {op.FCDMVT === "C" ? "Credit" : "Debit"} to {getPensionerName(op.FNDP)}
                    </Link>
                </p>
                <p className="text-muted-foreground">
                    {op.FMTREG.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} via {op.FMDREG}
                </p>
            </div>
            <div className="ml-auto font-medium">
                 <Badge variant={op.FCDMVT === "C" ? "default" : "destructive"}>
                     {op.FCDMVT === "C" ? "+" : "-"} {op.FMTREG.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                </Badge>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No recent activity to display.</p>
      )}
       <Button
        variant="outline"
        className="w-full"
        asChild
      >
        <Link href="/statistics">
            View All Reports
            <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
