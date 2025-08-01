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
import { Card, CardContent } from "@/components/ui/card";

export default function PensionersPage() {
  const [pensioners, setPensioners] = React.useState<Pensioner[]>(pensionersData);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("all");

  const cities = React.useMemo(() => {
    const allCities = pensionersData.map((p) => p.VILLE);
    return ["all", ...Array.from(new Set(allCities))];
  }, []);

  const paymentMethods = React.useMemo(() => {
    const allMethods = pensionersData.map((p) => p.MODREG);
    return ["all", ...Array.from(new Set(allMethods))];
  }, []);

  React.useEffect(() => {
    let filtered = pensionersData;

    if (searchTerm) {
      filtered = filtered.filter(
        (pensioner) =>
          pensioner.NOM1.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pensioner.NOM2.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(pensioner.MATRIC).includes(searchTerm) ||
          String(pensioner.SCPTE).includes(searchTerm)
      );
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter((p) => p.VILLE === selectedCity);
    }

    if (selectedPaymentMethod !== "all") {
      filtered = filtered.filter((p) => p.MODREG === selectedPaymentMethod);
    }

    setPensioners(filtered);
  }, [searchTerm, selectedCity, selectedPaymentMethod]);

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
          Search, filter, and manage pensioner records.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by name, matricule, or dossier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="grid grid-cols-2 gap-4 md:flex">
             <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city === "all" ? "All Cities" : city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Payment" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method === "all" ? "All Payments" : method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dossier No.</TableHead>
              <TableHead>Matricule</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Net Paid</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Payment Method</TableHead>
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
                  <TableCell>{pensioner.MODREG}</TableCell>
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
                <TableCell colSpan={7} className="h-24 text-center">
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
