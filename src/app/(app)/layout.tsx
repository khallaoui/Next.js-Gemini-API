"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/icons"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { UserNav } from "@/components/user-nav"
import { useAuth } from "@/contexts/auth-context"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()
  const [hasRedirected, setHasRedirected] = React.useState(false)

  React.useEffect(() => {
    console.log('AppLayout: Auth state:', { isAuthenticated, isLoading, pathname, hasRedirected })
    
    // Only redirect if not loading, not authenticated, and haven't redirected yet
    if (!isLoading && !isAuthenticated && !hasRedirected) {
      console.log('AppLayout: Redirecting to login')
      setHasRedirected(true)
      router.push("/login")
    }
    
    // Reset redirect flag when user becomes authenticated
    if (isAuthenticated && hasRedirected) {
      setHasRedirected(false)
    }
  }, [isAuthenticated, isLoading, router, pathname, hasRedirected])

  // Show loading while checking authentication
  if (isLoading) {
    console.log('AppLayout: Showing loading state')
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Logo className="h-16 w-16 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  // Show loading while redirecting
  if (!isAuthenticated) {
    console.log('AppLayout: Not authenticated, showing redirect state')
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Logo className="h-16 w-16 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirection vers la page de connexion...</p>
        </div>
      </div>
    )
  }

  console.log('AppLayout: Rendering authenticated layout')
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-sidebar-primary" />
            <span className="font-headline text-lg font-semibold text-sidebar-foreground">
              CIMR Insights
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end">
          <SidebarTrigger className="md:hidden" />
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}