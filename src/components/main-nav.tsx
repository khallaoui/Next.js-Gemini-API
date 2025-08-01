"use client"

import { usePathname } from "next/navigation"
import {
  BarChart2,
  Home,
  Users,
  BrainCircuit
} from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function MainNav() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/pensioners", label: "Pensioners", icon: Users },
    { href: "/analysis", label: "Analysis", icon: BrainCircuit },
  ]

  return (
    <SidebarMenu>
      {menuItems.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            as="a"
            href={href}
            isActive={pathname === href}
            tooltip={label}
          >
            <Icon />
            <span>{label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
