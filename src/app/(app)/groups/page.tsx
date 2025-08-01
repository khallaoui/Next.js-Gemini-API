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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Building, Eye, Users } from "lucide-react";
import groupsData from "@/data/groups.json";

interface Group {
  id: number;
  companyName: string;
  sector: string;
  memberCount: number;
  totalContribution: number;
  city: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = React.useState<Group[]>(groupsData);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSector, setSelectedSector] = React.useState("all");

  const sectors = React.useMemo(() => {
    const allSectors = groupsData.map((g) => g.sector);
    return ["all", ...Array.from(new Set(allSectors))];
  }, []);

  React.useEffect(() => {
    let filtered = groupsData;

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (group) =>
          group.companyName.toLowerCase().includes(lowercasedTerm)
      );
    }

    if (selectedSector !== "all") {
      filtered = filtered.filter((g) => g.sector === selectedSector);
    }

    setGroups(filtered);
  }, [searchTerm, selectedSector]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
            <Building className="h-8 w-8" />
            Adhérents en Groupe
        </h1>
        <p className="text-muted-foreground mt-1">
          Consultez et filtrez les entreprises adhérentes.
        </p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>Affinez la liste des groupes à l'aide des filtres ci-dessous.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom d'entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:flex">
             <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filtrer par Secteur" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector === "all" ? "Tous les secteurs" : sector}
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
                  <TableHead>Nom de l'Entreprise</TableHead>
                  <TableHead>Secteur</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Nombre d'Adhérents</TableHead>
                  <TableHead>Contribution Totale</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.companyName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{group.sector}</Badge>
                      </TableCell>
                      <TableCell>{group.city}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" /> 
                        {group.memberCount}
                      </TableCell>
                      <TableCell className="font-mono">
                        {group.totalContribution.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          {/* This would link to a group detail page */}
                          <Link href="#">
                            <Eye className="mr-2" />
                            Voir Détails
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Aucun groupe trouvé.
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
