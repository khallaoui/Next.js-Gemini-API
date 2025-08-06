"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { pensionerApi, type Pensioner } from "@/lib/api"

const chartConfig = {
  pensioners: {
    label: "Pensionnaires",
  },
  BANK_TRANSFER: {
    label: "Virement Bancaire",
    color: "hsl(var(--chart-1))",
  },
  CHECK: {
    label: "Chèque",
    color: "hsl(var(--chart-2))",
  },
  CASH: {
    label: "Espèces",
    color: "hsl(var(--chart-3))",
  },
  DIGITAL_WALLET: {
    label: "Portefeuille Numérique",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function PaymentMethodsChart() {
  const [chartData, setChartData] = React.useState<Array<{
    method: string;
    pensioners: number;
    fill: string;
  }>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchPaymentMethodsData() {
      try {
        setLoading(true);
        const pensioners = await pensionerApi.getAll();
        
        const methodCounts = pensioners.reduce((acc, p) => {
          acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const data = Object.entries(methodCounts).map(([method, count]) => ({
          method,
          pensioners: count,
          fill: `var(--color-${method})`,
        }));

        setChartData(data);
      } catch (err: any) {
        console.error("Error fetching payment methods data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentMethodsData();
  }, []);

  const totalPensioners = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.pensioners, 0);
  }, [chartData]);

  if (loading) {
    return (
      <div className="mx-auto aspect-square max-h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto aspect-square max-h-[300px] flex items-center justify-center">
        <div className="text-red-500 text-sm text-center">
          Erreur lors du chargement<br />des données
        </div>
      </div>
    );
  }

  return (
     <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="pensioners"
          nameKey="method"
          innerRadius={60}
          strokeWidth={5}
        >
             <Label
                content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                    <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                        >
                        {totalPensioners.toLocaleString()}
                        </tspan>
                        <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                        >
                        Pensionnaires
                        </tspan>
                    </text>
                    )
                }
                }}
            />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
