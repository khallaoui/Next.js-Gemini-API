import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">
          Key metrics and visualizations for administrators.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 />
            Reporting Dashboard
          </CardTitle>
          <CardDescription>
            High-level statistics and KPIs will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              Statistical charts and reports are coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
