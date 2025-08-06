"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pensionerApi, type Pensioner } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewPensionerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    monthlyPayment: "",
    paymentMethod: "" as Pensioner['paymentMethod'] | "",
    phoneNumber: "",
    birthDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.city || !formData.monthlyPayment || !formData.paymentMethod) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const pensionerData: Omit<Pensioner, 'id'> = {
        name: formData.name,
        city: formData.city,
        monthlyPayment: parseFloat(formData.monthlyPayment),
        paymentMethod: formData.paymentMethod as Pensioner['paymentMethod'],
        phoneNumber: formData.phoneNumber || undefined,
        birthDate: formData.birthDate || undefined,
      };

      await pensionerApi.create(pensionerData);
      router.push("/pensioners");
    } catch (err: any) {
      console.error("Error creating pensioner:", err);
      setError(err.message || "Erreur lors de la création du pensionnaire");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/pensioners">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline">Nouveau Pensionnaire</h1>
          <p className="text-muted-foreground mt-1">
            Ajoutez un nouveau pensionnaire au système.
          </p>
        </div>
      </header>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations du Pensionnaire</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-600 p-3 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom Complet *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ex: Ahmed Hassan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Ex: Rabat"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyPayment">Paiement Mensuel (MAD) *</Label>
                <Input
                  id="monthlyPayment"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monthlyPayment}
                  onChange={(e) => handleInputChange("monthlyPayment", e.target.value)}
                  placeholder="Ex: 2500.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Mode de Paiement *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_TRANSFER">Virement Bancaire</SelectItem>
                    <SelectItem value="CHECK">Chèque</SelectItem>
                    <SelectItem value="CASH">Espèces</SelectItem>
                    <SelectItem value="DIGITAL_WALLET">Portefeuille Numérique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Numéro de Téléphone</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="Ex: 0612345678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Date de Naissance</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer le Pensionnaire
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/pensioners">Annuler</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}