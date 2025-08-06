"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { operationApi, type Operation } from "@/lib/api"
import { mockMonthlyPayments } from "@/lib/mock-data"

interface MonthlyData {
  month: string;
  payments: number;
}

const chartConfig = {
  payments: {
    label: "Paiements",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export function MonthlyPaymentsChart() {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    async function fetchPaymentData() {
      try {
        setLoading(true);
        
        try {
          // Try to fetch from backend
          const operations = await operationApi.getAll();
          
          // Filter payment operations and group by month
          const paymentOperations = operations.filter(op => 
            op.type === 'PAYMENT' || op.type === 'BONUS'
          );

          // Group by month
          const monthlyTotals: { [key: string]: number } = {};
          
          paymentOperations.forEach(operation => {
            const date = new Date(operation.timestamp);
            const monthName = monthNames[date.getMonth()];
            
            if (!monthlyTotals[monthName]) {
              monthlyTotals[monthName] = 0;
            }
            monthlyTotals[monthName] += operation.amount;
          });

          // Convert to chart data format
          const data = Object.entries(monthlyTotals).map(([month, payments]) => ({
            month,
            payments
          }));

          // If no data, use current year months with zero values
          if (data.length === 0) {
            setChartData(monthNames.slice(0, 6).map(month => ({ month, payments: 0 })));
          } else {
            setChartData(data);
          }
          setUsingMockData(false);

        } catch (backendError) {
          console.log("Backend not available, using mock data for chart");
          // Use mock data as fallback
          setChartData(mockMonthlyPayments.map(item => ({
            month: item.month,
            payments: item.amount
          })));
          setUsingMockData(true);
        }

      } catch (err: any) {
        console.error("Error fetching payment data:", err);
        setError(err.message);
        // Final fallback to empty data
        setChartData(monthNames.slice(0, 6).map(month => ({ month, payments: 0 })));
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[200px] w-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement des données...</div>
      </div>
    );
  }

  if (error && !usingMockData) {
    return (
      <div className="min-h-[200px] w-full flex items-center justify-center">
        <div className="text-red-500 text-sm">
          Erreur lors du chargement des données de paiement
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {usingMockData && (
        <div className="text-amber-600 text-xs bg-amber-50 p-2 rounded border border-amber-200">
          Données de démonstration (backend non disponible)
        </div>
      )}
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickFormatter={(value) => `${Number(value) / 1000000}M MAD`}
          />
          <ChartTooltip
              content={<ChartTooltipContent 
                  formatter={(value, name) => (
                      <div className="flex flex-col">
                          <span className="font-medium">{name === 'payments' ? 'Paiements' : name}</span>
                          <span className="text-muted-foreground">
                            {new Intl.NumberFormat('fr-MA', { 
                              style: 'currency', 
                              currency: 'MAD' 
                            }).format(Number(value))}
                          </span>
                      </div>
                  )}
              />}
          />
          <Bar dataKey="payments" fill="var(--color-payments)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}