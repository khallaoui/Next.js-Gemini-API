import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PensionersByCityChart } from "@/components/statistics/pensioners-by-city-chart";
import { PaymentMethodsChart } from "@/components/statistics/payment-methods-chart";
import { MonthlyPaymentsChart } from "@/components/dashboard/monthly-payments-chart";
import { BarChart3 } from "lucide-react";


export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="h-8 w-8"/>
            Statistiques & Rapports
        </h1>
        <p className="text-muted-foreground mt-1">
          Indicateurs clés et visualisations pour les administrateurs.
        </p>
      </header>
      
      <StatsCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pensionnaires par Ville</CardTitle>
            <CardDescription>Répartition des pensionnaires à travers différentes villes.</CardDescription>
          </CardHeader>
          <CardContent>
            <PensionersByCityChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Modes de Paiement</CardTitle>
            <CardDescription>Répartition des modes de paiement utilisés.</CardDescription>
          </Header>
          <CardContent>
            <PaymentMethodsChart />
          </CardContent>
        </Card>
      </div>
       <Card>
          <CardHeader>
            <CardTitle>Aperçu des Paiements Mensuels</CardTitle>
            <CardDescription>Un graphique montrant le total des prestations payées chaque mois.</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyPaymentsChart />
          </CardContent>
        </Card>
    </div>
  );
}
