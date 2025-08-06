"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserCog, Undo2 } from "lucide-react";
import { dashboardApi, operationApi, type DashboardStats } from "@/lib/api";
import { mockDashboardStats, mockRecentOperations } from "@/lib/mock-data";

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refundedCount, setRefundedCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      
      try {
        // Try to fetch from backend first
        console.log("StatsCards: Attempting to fetch from backend...");
        const dashboardStats = await dashboardApi.getStats();
        const operations = await operationApi.getAll();
        
        console.log("StatsCards: Backend data received successfully");
        setStats(dashboardStats);
        
        // Calculate refunded pensioners count
        const refundedPensioners = new Set(
          operations
            .filter((op) => op.type === "DEDUCTION")
            .map((op) => op.pensioner?.id || op.pensionerId)
            .filter(Boolean)
        );
        setRefundedCount(refundedPensioners.size);
        setUsingMockData(false);
        
      } catch (backendError: any) {
        console.log("StatsCards: Backend failed, using mock data:", backendError.message);
        
        // Use mock data as fallback
        setStats(mockDashboardStats);
        
        // Calculate refunded count from mock data
        const refundedPensioners = new Set(
          mockRecentOperations
            .filter((op) => op.type === "DEDUCTION")
            .map((op) => op.pensioner?.id || op.pensionerId)
            .filter(Boolean)
        );
        setRefundedCount(refundedPensioners.size);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // If we don't have stats by now, something went wrong - use mock data
  if (!stats || refundedCount === null) {
    console.log("StatsCards: No stats available, falling back to mock data");
    return (
      <div className="space-y-4">
        <div className="text-amber-600 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm">
            <strong>Mode démonstration:</strong> Utilisation de données fictives car le backend n'est pas disponible.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des Pensionnaires</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDashboardStats.totalPensioners.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Tous les pensionnaires enregistrés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pensionnaires Actifs</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDashboardStats.totalPensioners.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Pensionnaires recevant des paiements</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des Opérations</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockDashboardStats.totalOperations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Toutes les transactions effectuées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Déductions Appliquées</CardTitle>
              <Undo2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Pensionnaires avec déductions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate active pensioners (assuming all pensioners are active for now)
  const activePensioners = stats.totalPensioners;

  return (
    <div className="space-y-4">
      {usingMockData && (
        <div className="text-amber-600 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm">
            <strong>Mode démonstration:</strong> Utilisation de données fictives car le backend n'est pas disponible.
          </p>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Pensionnaires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPensioners.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Tous les pensionnaires enregistrés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pensionnaires Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePensioners.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Pensionnaires recevant des paiements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Opérations</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOperations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Toutes les transactions effectuées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Déductions Appliquées</CardTitle>
            <Undo2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refundedCount}</div>
            <p className="text-xs text-muted-foreground">Pensionnaires avec déductions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}