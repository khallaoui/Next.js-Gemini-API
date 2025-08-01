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


export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">
          Key metrics and visualizations for administrators.
        </p>
      </div>
      
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
