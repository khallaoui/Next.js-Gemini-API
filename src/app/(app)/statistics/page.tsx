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
            Statistics & Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          Key metrics and visualizations for administrators.
        </p>
      </header>
      
      <StatsCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pensioners by City</CardTitle>
            <CardDescription>Distribution of pensioners across different cities.</CardDescription>
          </CardHeader>
          <CardContent>
            <PensionersByCityChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Breakdown of payment methods used.</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentMethodsChart />
          </CardContent>
        </Card>
      </div>
       <Card>
          <CardHeader>
            <CardTitle>Monthly Payments Overview</CardTitle>
            <CardDescription>A chart showing total benefits paid out each month.</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyPaymentsChart />
          </CardContent>
        </Card>
    </div>
  );
}
