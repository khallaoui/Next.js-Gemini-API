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
import pensionersData from "@/data/pensioners.json"

const chartConfig = {
  pensioners: {
    label: "Pensioners",
  },
  Paris: {
    label: "Paris",
    color: "hsl(var(--chart-1))",
  },
  Marseille: {
    label: "Marseille",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function PensionersByCityChart() {
  const chartData = React.useMemo(() => {
    const cityCounts = pensionersData.reduce((acc, p) => {
      const city = p.personalInfo.ville;
      acc[city] = (acc[city] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(cityCounts).map(([city, count]) => ({
      city,
      pensioners: count,
      fill: `var(--color-${city})`,
    }))
  }, [])

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
