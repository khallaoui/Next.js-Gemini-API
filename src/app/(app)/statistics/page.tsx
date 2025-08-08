"use client";

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
import ChatWindow from "@/components/ChatWindow";
import { pensionerApi, operationApi } from "@/lib/api";
import { useState, useEffect } from "react";

export default function StatisticsPage() {
  const [statisticsData, setStatisticsData] = useState("[]");

  useEffect(() => {
    async function loadStatisticsData() {
      try {
        const [pensioners, operations] = await Promise.all([
          pensionerApi.getAll(),
          operationApi.getAll()
        ]);
        
        const statsInfo = {
          totalPensioners: pensioners.length,
          totalOperations: operations.length,
          pensionersByCity: pensioners.reduce((acc, p) => {
            acc[p.city] = (acc[p.city] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          paymentMethods: pensioners.reduce((acc, p) => {
            acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          averagePayment: pensioners.reduce((sum, p) => sum + p.monthlyPayment, 0) / pensioners.length,
          totalMonthlyPayments: pensioners.reduce((sum, p) => sum + p.monthlyPayment, 0),
          summary: "Données statistiques complètes"
        };
        setStatisticsData(JSON.stringify(statsInfo, null, 2));
      } catch (error) {
        console.error("Error loading statistics data:", error);
        setStatisticsData(JSON.stringify({ error: "Données statistiques non disponibles" }, null, 2));
      }
    }
    loadStatisticsData();
  }, []);
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
          </CardHeader>
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

      {/* AI Chat Window */}
      <ChatWindow pensionData={statisticsData} />
    </div>
  );
}
