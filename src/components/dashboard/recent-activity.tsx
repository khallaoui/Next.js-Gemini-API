"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { operationApi, pensionerApi, type Operation, type Pensioner } from "@/lib/api";
import { mockRecentOperations } from "@/lib/mock-data";

export function RecentActivity() {
  const [recentOperations, setRecentOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    async function fetchRecentActivity() {
      setLoading(true);
      
      try {
        // Try to fetch from backend
        console.log("RecentActivity: Attempting to fetch from backend...");
        const [operations, pensionersData] = await Promise.all([
          operationApi.getAll(),
          pensionerApi.getAll()
        ]);

        console.log("RecentActivity: Backend data received successfully");
        
        // Sort operations by timestamp (most recent first) and take top 5
        const sortedOperations = operations
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);

        // Enrich operations with pensioner data
        const enrichedOperations = sortedOperations.map(op => ({
          ...op,
          pensioner: op.pensioner || pensionersData.find(p => p.id === op.pensionerId)
        }));

        setRecentOperations(enrichedOperations);
        setUsingMockData(false);

      } catch (backendError: any) {
        console.log("RecentActivity: Backend failed, using mock data:", backendError.message);
        
        // Use mock data as fallback - it already has embedded pensioner data
        setRecentOperations(mockRecentOperations.slice(0, 5));
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentActivity();
  }, []);

  const getPensionerInitials = (operation: Operation) => {
    const pensioner = operation.pensioner;
    if (!pensioner?.name) return "??";
    
    const names = pensioner.name.split(" ");
    return names.map(name => name[0]).join("").toUpperCase().slice(0, 2);
  };
  
  const getPensionerName = (operation: Operation) => {
    return operation.pensioner?.name || "Pensionnaire inconnu";
  }
  
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER': return 'Virement';
      case 'CHECK': return 'Chèque';
      case 'CASH': return 'Espèces';
      case 'DIGITAL_WALLET': return 'Portefeuille numérique';
      default: return 'Inconnu';
    }
  }

  const getOperationTypeText = (type: string) => {
    switch (type) {
      case 'PAYMENT': return 'Paiement';
      case 'BONUS': return 'Prime';
      case 'ADJUSTMENT': return 'Ajustement';
      case 'DEDUCTION': return 'Déduction';
      default: return 'Opération';
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const operationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - operationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `il y a ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `il y a ${days}j`;
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
            <div className="grid gap-1 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {usingMockData && (
        <div className="text-amber-600 text-xs bg-amber-50 p-2 rounded border border-amber-200">
          Données de démonstration (backend non disponible)
        </div>
      )}
      
      {recentOperations.length > 0 ? (
        recentOperations.map((operation) => {
          return (
            <div key={operation.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{getPensionerInitials(operation)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 text-sm flex-1">
                <p className="font-medium leading-none">
                  {getOperationTypeText(operation.type)} - {getPensionerName(operation)}
                </p>
                <p className="text-muted-foreground">
                  {operation.amount.toLocaleString("fr-MA", { style: "currency", currency: "MAD" })} 
                  {operation.pensioner && ` via ${getPaymentMethodText(operation.pensioner.paymentMethod)}`}
                  <span className="ml-2 text-xs">
                    {formatTimeAgo(operation.timestamp)}
                  </span>
                </p>
                {operation.description && (
                  <p className="text-xs text-muted-foreground">{operation.description}</p>
                )}
              </div>
              <div className="ml-auto font-medium">
                <Badge variant={
                  operation.type === "PAYMENT" || operation.type === "BONUS" ? "default" : 
                  operation.type === "DEDUCTION" ? "destructive" : "secondary"
                }>
                  {operation.type === "DEDUCTION" ? "-" : "+"} 
                  {operation.amount.toLocaleString("fr-MA", { style: "currency", currency: "MAD" })}
                </Badge>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-muted-foreground">Aucune activité récente à afficher.</p>
      )}
      <Button
        variant="outline"
        className="w-full"
        asChild
      >
        <Link href="/statistics">
          Voir tous les rapports
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}