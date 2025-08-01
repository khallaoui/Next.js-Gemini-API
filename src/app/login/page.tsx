"use client"

import { Logo } from "@/components/icons";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
            <Logo className="h-16 w-16 text-primary" />
            <h1 className="mt-4 text-center font-headline text-3xl font-bold text-primary">
              CIMR Insights
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Welcome back. Please log in to your account.
            </p>
        </div>
        <LoginForm />
        <p className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CIMR. All rights reserved.
        </p>
      </div>
    </div>
  );
}
