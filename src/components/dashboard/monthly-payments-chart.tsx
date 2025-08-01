"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", payments: 186000 },
  { month: "February", payments: 305000 },
  { month: "March", payments: 237000 },
  { month: "April", payments: 273000 },
  { month: "May", payments: 209000 },
  { month: "June", payments: 214000 },
]

const chartConfig = {
  payments: {
    label: "Payments",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function MonthlyPaymentsChart() {
  return (
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
          tickFormatter={(value) => `€${Number(value) / 1000}k`}
        />
        <ChartTooltip
            content={<ChartTooltipContent 
                formatter={(value, name) => (
                    <div className="flex flex-col">
                        <span className="font-medium">{name}</span>
                        <span className="text-muted-foreground">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))}</span>
                    </div>
                )}
            />}
        />
        <Bar dataKey="payments" fill="var(--color-payments)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
