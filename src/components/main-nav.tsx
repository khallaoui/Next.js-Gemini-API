"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  BrainCircuit,
  BarChart3,
  Building
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function MainNav() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/", label: "Tableau de Bord", icon: Home },
    { href: "/pensioners", label: "Adhérents", icon: Users },
    { href: "/groups", label: "Groupes", icon: Building },
    { href: "/analysis", label: "Analyse IA", icon: BrainCircuit },
    { href: "/statistics", label: "Statistiques", icon: BarChart3 },
  ]

  return (
    <SidebarMenu>
      {menuItems.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === href}
            tooltip={label}
          >
            <Link href={href}>
              <Icon />
              <span>{label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
