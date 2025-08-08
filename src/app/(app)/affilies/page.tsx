"use client";

import * as React from "react";
import { affilieApi, type Affilie } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Eye, Plus } from "lucide-react";
import Link from "next/link";

export default function AffiliesPage() {
  const [affilies, setAffilies] = React.useState<Affilie[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchAffilies() {
      try {
        setLoading(true);
        const data = await affilieApi.getAll();
        setAffilies(data);
      } catch (err: any) {
        console.error("Error fetching affilies:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAffilies();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
            <Users className="h-8 w-8" />
            Affiliés
          </h1>
          <p className="text-muted-foreground mt-1">
            Chargement des données des affiliés...
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
          <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
            <Users className="h-8 w-8" />
            Affiliés
          </h1>
        </header>
        <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-semibold">Erreur lors du chargement des Affiliés</h3>
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
          <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
            <Users className="h-8 w-8" />
            Affiliés
          </h1>
          <p className="text-muted-foreground mt-1">
            Liste des affiliés enregistrés dans le système.
          </p>
        </div>
        <Button asChild>
          <Link href="/affilies/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Affilié
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Affiliés</CardTitle>
          <CardDescription>Affichés depuis l'API</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Actif</TableHead>
                  <TableHead>Ayant Droit</TableHead>
                  <TableHead>Adhérent ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affilies.length > 0 ? (
                  affilies.map((a) => (
                    <TableRow key={a.idAffilie}>
                      <TableCell className="font-medium">{a.idAffilie}</TableCell>
                      <TableCell className="font-medium">{a.nom}</TableCell>
                      <TableCell>{a.prenom}</TableCell>
                      <TableCell>{a.matricule}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          a.actif 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {a.actif ? "Oui" : "Non"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          a.ayantDroit 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {a.ayantDroit ? "Oui" : "Non"}
                        </span>
                      </TableCell>
                      <TableCell>{a.adherentId}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/affilies/${a.idAffilie}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Aucun affilié trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Total: {affilies.length} affilié(s) affiché(s)
      </div>
    </div>
  );
}