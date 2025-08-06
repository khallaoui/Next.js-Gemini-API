"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { pensionerApi } from "@/lib/api"

export function PensionersByCityChart() {
  const [chartData, setChartData] = React.useState<Array<{
    city: string;
    pensioners: number;
    fill: string;
  }>>([]);
  const [chartConfig, setChartConfig] = React.useState<ChartConfig>({
    pensioners: { label: "Pensionnaires" }
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchCityData() {
      try {
        setLoading(true);
        const pensioners = await pensionerApi.getAll();
        
        // Count pensioners by city
        const cityCounts = pensioners.reduce((acc, p) => {
          const city = p.city;
          acc[city] = (acc[city] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Generate chart data
        const data = Object.entries(cityCounts).map(([city, count], index) => ({
          city,
          pensioners: count,
          fill: `var(--color-${city})`,
        }));

        // Generate dynamic chart config
        const config = Object.keys(cityCounts).reduce((acc, city, index) => {
          acc[city] = {
            label: city,
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
          };
          return acc;
        }, {
          pensioners: { label: "Pensionnaires" }
        } as ChartConfig);

        setChartData(data);
        setChartConfig(config);
      } catch (err: any) {
        console.error("Error fetching city data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCityData();
  }, []);

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
          content={<ChartTooltipContent hideLabel nameKey="city" />}
        />
        <Pie
          data={chartData}
          dataKey="pensioners"
          nameKey="city"
          innerRadius={60}
          strokeWidth={5}
        />
        <ChartLegend
            content={<ChartLegendContent nameKey="city" />}
            className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  )
}
