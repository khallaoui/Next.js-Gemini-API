"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuth, setIsAuth] = React.useState(false)

  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem("cimr-insights-auth")
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      setIsAuth(true)
    }
  }, [router])

  if (!isAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Logo className="h-16 w-16 animate-pulse text-primary" />
      </div>
    )
  }

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
