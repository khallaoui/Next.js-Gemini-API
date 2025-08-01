"use client"

import { Logo } from "@/components/icons";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
            <Logo className="h-16 w-16 text-primary mx-auto" />
            <h1 className="mt-4 font-headline text-3xl font-bold text-foreground">
              CIMR Insights
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Bienvenue. Veuillez vous connecter à votre compte.
            </p>
        </div>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
            <LoginForm />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CIMR. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
