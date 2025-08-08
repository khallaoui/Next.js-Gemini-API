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
import { pensionerApi, type Pensioner } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Users, Eye, Plus, Building } from "lucide-react";
import ChatWindow from "@/components/ChatWindow";

export default function GroupsPage() {
  const [allPensioners, setAllPensioners] = React.useState<Pensioner[]>([]);
  const [filteredPensioners, setFilteredPensioners] = React.useState<Pensioner[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("all");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch pensioners from API
  React.useEffect(() => {
    async function fetchPensioners() {
      try {
        setLoading(true);
        const data = await pensionerApi.getAll();
        setAllPensioners(data);
        setFilteredPensioners(data);
      } catch (err: any) {
        console.error("Error fetching pensioners:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPensioners();
  }, []);

  const cities = React.useMemo(() => {
    const allCities = allPensioners.map((p) => p.city);
    return ["all", ...Array.from(new Set(allCities))];
  }, [allPensioners]);

  const paymentMethods = React.useMemo(() => {
    const allMethods = allPensioners.map((p) => p.paymentMethod);
    return ["all", ...Array.from(new Set(allMethods))];
  }, [allPensioners]);

  // Filter pensioners based on search and filters
  React.useEffect(() => {
    let filtered = allPensioners;

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (pensioner) =>
          pensioner.name.toLowerCase().includes(lowercasedTerm) ||
          String(pensioner.id).includes(lowercasedTerm) ||
          pensioner.phoneNumber?.toLowerCase().includes(lowercasedTerm)
      );
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter((p) => p.city === selectedCity);
    }

    if (selectedPaymentMethod !== "all") {
      filtered = filtered.filter((p) => p.paymentMethod === selectedPaymentMethod);
    }

    setFilteredPensioners(filtered);
  }, [searchTerm, selectedCity, selectedPaymentMethod, allPensioners]);

  const getPaymentAmountVariant = (amount: number) => {
    if (amount > 2500) return "default";
    if (amount > 2000) return "secondary";
    return "outline";
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER': return 'Virement';
      case 'CHECK': return 'Chèque';
      case 'CASH': return 'Espèces';
      case 'DIGITAL_WALLET': return 'Portefeuille numérique';
      default: return method;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8" />
            Adhérents
          </h1>
          <p className="text-muted-foreground mt-1">
            Chargement des données des Adhérents...
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
            <Users className="h-8 w-8" />
            Adhérents
          </h1>
        </header>
        <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-semibold">Erreur lors du chargement des Adhérents</h3>
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
      <header className="flex justify-between items-start">
        <div>
          <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
            <Building className="h-8 w-8" />
            Groupes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les groupes de pensionnaires et leurs informations.
          </p>
        </div>
        <Button asChild>
          <Link href="/groups/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Groupe
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Affinez la liste des Adhérents à l'aide des filtres ci-dessous.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, ID, ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:flex">
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
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrer par Paiement" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method === "all" ? "Tous les paiements" : getPaymentMethodText(method)}
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
                  <TableHead>ID</TableHead>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Paiement Mensuel</TableHead>
                  <TableHead>Mode de Paiement</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPensioners.length > 0 ? (
                  filteredPensioners.map((pensioner) => (
                    <TableRow key={pensioner.id}>
                      <TableCell className="font-medium">{pensioner.id}</TableCell>
                      <TableCell className="font-medium">{pensioner.name}</TableCell>
                      <TableCell>{pensioner.city}</TableCell>
                      <TableCell>
                        <Badge variant={getPaymentAmountVariant(pensioner.monthlyPayment)} className="font-mono">
                          {pensioner.monthlyPayment.toLocaleString("fr-MA", {
                            style: "currency",
                            currency: "MAD",
                          })}
                        </Badge>
                      </TableCell>
                      <TableCell>{getPaymentMethodText(pensioner.paymentMethod)}</TableCell>
                      <TableCell>{pensioner.phoneNumber || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/pensioners/${pensioner.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir Détails
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Aucun pensionnaire trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Total: {filteredPensioners.length} pensionnaire(s) affiché(s) sur {allPensioners.length}
      </div>

      {/* AI Chat Window */}
      <ChatWindow pensionData={JSON.stringify({ 
        groupData: filteredPensioners,
        groupedByCity: cities.map(city => ({
          city,
          count: city === "all" ? allPensioners.length : allPensioners.filter(p => p.city === city).length
        }))
      }, null, 2)} />
    </div>
  );
}