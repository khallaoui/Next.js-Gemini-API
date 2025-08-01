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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Users, Eye } from "lucide-react";

export default function PensionersPage() {
  const [pensioners, setPensioners] = React.useState<Pensioner[]>(pensionersData);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("all");
  const [selectedStatus, setSelectedStatus] = React.useState("all");

  const cities = React.useMemo(() => {
    const allCities = pensionersData.map((p) => p.personalInfo.ville);
    return ["all", ...Array.from(new Set(allCities))];
  }, []);

  const paymentMethods = React.useMemo(() => {
    const allMethods = pensionersData.map((p) => p.paymentMethod);
    return ["all", ...Array.from(new Set(allMethods))];
  }, []);
  
  const statuses = React.useMemo(() => {
    const allStatuses = pensionersData.map((p) => p.status);
    return ["all", ...Array.from(new Set(allStatuses))];
  }, []);

  React.useEffect(() => {
    let filtered = pensionersData;

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (pensioner) =>
          pensioner.personalInfo.firstName.toLowerCase().includes(lowercasedTerm) ||
          pensioner.personalInfo.lastName.toLowerCase().includes(lowercasedTerm) ||
          String(pensioner.matricule).includes(lowercasedTerm) ||
          String(pensioner.SCPTE).includes(lowercasedTerm)
      );
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter((p) => p.personalInfo.ville === selectedCity);
    }

    if (selectedPaymentMethod !== "all") {
      filtered = filtered.filter((p) => p.paymentMethod === selectedPaymentMethod);
    }
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter((p) => p.status === selectedStatus);
    }

    setPensioners(filtered);
  }, [searchTerm, selectedCity, selectedPaymentMethod, selectedStatus]);

  const getStatusVariant = (netRgt: number) => {
    if (netRgt > 2000) return "default";
    if (netRgt > 1700) return "secondary";
    return "outline";
  };
  
  const getPensionerStatusVariant = (status: string) => {
    if (status === "ACTIF") return "default";
    if (status === "INACTIF") return "secondary";
    return "outline";
  };


  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8" />
            Adhérents Individuels & Allocataires
        </h1>
        <p className="text-muted-foreground mt-1">
          Recherchez, filtrez et gérez les dossiers des adhérents et allocataires.
        </p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>Affinez la liste des pensionnaires à l'aide des filtres ci-dessous.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, matricule, ou dossier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:flex">
             <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Filtrer par Statut" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "Tous les statuts" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Filtrer par Ville" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city === "all" ? "Toutes les villes" : city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrer par Paiement" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method === "all" ? "Tous les paiements" : method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Dossier</TableHead>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Net Payé</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Mode de Paiement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pensioners.length > 0 ? (
                  pensioners.map((pensioner) => (
                    <TableRow key={pensioner.SCPTE}>
                      <TableCell className="font-medium">{pensioner.SCPTE}</TableCell>
                      <TableCell>
                        {pensioner.personalInfo.firstName} {pensioner.personalInfo.lastName}
                      </TableCell>
                       <TableCell>
                        <Badge variant={getPensionerStatusVariant(pensioner.status)}>{pensioner.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(pensioner.netPaid)} className="font-mono">
                          {pensioner.netPaid.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </Badge>
                      </TableCell>
                      <TableCell>{pensioner.personalInfo.ville}</TableCell>
                      <TableCell>{pensioner.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/pensioners/${pensioner.SCPTE}`}>
                            <Eye className="mr-2" />
                            Voir Détails
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Aucun résultat trouvé.
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
