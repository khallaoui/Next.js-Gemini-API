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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Pensioner } from "@/lib/types";
import pensionersData from "@/data/pensioners.json";

export default function PensionersPage() {
  const [pensioners, setPensioners] = React.useState<Pensioner[]>(pensionersData);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const filtered = pensionersData.filter(
      (pensioner) =>
        pensioner.NOM1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pensioner.NOM2.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(pensioner.MATRIC).includes(searchTerm) ||
        String(pensioner.SCPTE).includes(searchTerm)
    );
    setPensioners(filtered);
  }, [searchTerm]);

  const getStatusVariant = (netRgt: number) => {
    if (netRgt > 2000) return "default";
    if (netRgt > 1700) return "secondary";
    return "outline";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h1 className="font-headline text-3xl font-bold">Pensioner Records</h1>
        <p className="text-muted-foreground">
          Search and manage pensioner records.
        </p>
      </div>

      <div className="flex items-center">
        <Input
          placeholder="Search by name, matricule, or dossier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dossier No.</TableHead>
              <TableHead>Matricule</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Net Paid</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pensioners.length > 0 ? (
              pensioners.map((pensioner) => (
                <TableRow key={pensioner.SCPTE}>
                  <TableCell className="font-medium">{pensioner.SCPTE}</TableCell>
                  <TableCell>{pensioner.MATRIC}</TableCell>
                  <TableCell>
                    {pensioner.NOM1} {pensioner.NOM2}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(pensioner.NETRGT)}>
                      {pensioner.NETRGT.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </Badge>
                  </TableCell>
                  <TableCell>{pensioner.VILLE}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/pensioners/${pensioner.SCPTE}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
