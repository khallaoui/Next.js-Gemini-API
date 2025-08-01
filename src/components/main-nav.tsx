"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  BrainCircuit,
  BarChart3
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
    { href: "/statistics", label: "Statistics", icon: BarChart3 },
  ]

  return (
    <SidebarMenu>
      {menuItems.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <Link href={href} passHref>
            <SidebarMenuButton
              as="a"
              isActive={pathname === href}
              tooltip={label}
            >
              <Icon />
              <span>{label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
