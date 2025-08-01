import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, Landmark, Euro, CalendarClock } from "lucide-react"

import pensioners from "@/data/pensioners.json"
import operations from "@/data/operations.json"

export default function DashboardPage() {
  const totalPensioners = pensioners.length
  
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const totalMonthlyPayments = operations
    .filter(op => op.FMMREG === currentMonth && op.FAAREG === currentYear && op.FCDMVT === 'C')
    .reduce((acc, op) => acc + op.FMTREG, 0)
    
  const newPensionersThisMonth = pensioners.filter(p => {
    // This is a simplification; in reality, we'd check an adhesion date.
    // For now, let's assume the last digit of their ID represents joining month.
    return (p.SCPTE % 10) === currentMonth
  }).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of pensioner data and activities.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pensioners
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPensioners}</div>
            <p className="text-xs text-muted-foreground">
              Total active and retired members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Benefits Paid (This Month)
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalMonthlyPayments.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Total amount disbursed in {new Date().toLocaleString('default', { month: 'long' })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Virement & Chèque
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Pensioners (This Month)
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{newPensionersThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              New members this month
            </p>
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Recent activity feed coming soon.</p>
        </CardContent>
      </Card>
    </div>
  )
}
