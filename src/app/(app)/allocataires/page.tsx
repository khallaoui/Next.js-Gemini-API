"use client";

import * as React from "react";
import { allocataireApi, type Allocataire } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Users, Eye, Plus } from "lucide-react";
import Link from "next/link";
import ChatWindow from "@/components/ChatWindow";

export default function AllocatairesPage() {
  const [allocataires, setAllocataires] = React.useState<Allocataire[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchAllocataires() {
      try {
        setLoading(true);
        const data = await allocataireApi.getAll();
        setAllocataires(data);
      } catch (err: any) {
        console.error("Error fetching allocataires:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAllocataires();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
            <Users className="h-8 w-8" />
            Allocataires
          </h1>
          <p className="text-muted-foreground mt-1">
            Chargement des données des allocataires...
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
            Allocataires
          </h1>
        </header>
        <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-semibold">Erreur lors du chargement des Allocataires</h3>
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
            Allocataires
          </h1>
          <p className="text-muted-foreground mt-1">
            Liste des allocataires associés aux affiliés.
          </p>
        </div>
        <Button asChild>
          <Link href="/allocataires/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Allocataire
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Allocataires</CardTitle>
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
                  <TableHead>Numéro Dossier</TableHead>
                  <TableHead>Affilié ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocataires.length > 0 ? (
                  allocataires.map((a) => (
                    <TableRow key={a.idAllocataire}>
                      <TableCell className="font-medium">{a.idAllocataire}</TableCell>
                      <TableCell className="font-medium">{a.nom}</TableCell>
                      <TableCell>{a.prenom}</TableCell>
                      <TableCell>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {a.numeroDossier}
                        </span>
                      </TableCell>
                      <TableCell>{a.affilieId}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/allocataires/${a.idAllocataire}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Aucun allocataire trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Total: {allocataires.length} allocataire(s) affiché(s)
      </div>

      {/* AI Chat Window */}
      <ChatWindow pensionData={JSON.stringify(allocataires, null, 2)} />
    </div>
  );
}