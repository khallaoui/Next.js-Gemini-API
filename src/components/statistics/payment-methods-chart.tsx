"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import pensionersData from "@/data/pensioners.json"

const chartConfig = {
  pensioners: {
    label: "Pensioners",
  },
  Virement: {
    label: "Virement",
    color: "hsl(var(--chart-1))",
  },
  Chèque: {
    label: "Chèque",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function PaymentMethodsChart() {
    const chartData = React.useMemo(() => {
        const methodCounts = pensionersData.reduce((acc, p) => {
          acc[p.MODREG] = (acc[p.MODREG] || 0) + 1
          return acc
        }, {} as Record<string, number>)
    
        return Object.entries(methodCounts).map(([method, count]) => ({
          method,
          pensioners: count,
          fill: `var(--color-${method})`,
        }))
      }, [])

  const totalPensioners = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.pensioners, 0)
  }, [chartData])

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
                        Pensioners
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
