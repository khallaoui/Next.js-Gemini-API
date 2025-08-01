import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { MonthlyPaymentsChart } from "@/components/dashboard/monthly-payments-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Home } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
          <Home className="h-8 w-8" />
          Tableau de Bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Un aperçu des données et activités des pensionnaires.
        </p>
      </header>

      <StatsCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Aperçu des Paiements Mensuels</CardTitle>
            <CardDescription>Un graphique montrant le total des prestations payées chaque mois.</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyPaymentsChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Un flux des événements et actions récents du système.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
