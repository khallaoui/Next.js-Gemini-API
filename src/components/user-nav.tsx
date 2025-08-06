"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

export function UserNav() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      console.log('UserNav: Logging out')
      await logout()
      console.log('UserNav: Logout complete, redirecting to login')
      router.push("/login")
    } catch (error) {
      console.error("UserNav: Logout error:", error)
      // Force redirect even if logout fails
      router.push("/login")
    }
  }

  const getUserInitials = () => {
    if (!user?.username) return "AD"
    const names = user.username.split(" ")
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase()
    }
    return user.username.slice(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@user" />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.username || "Admin"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.username ? `${user.username}@cimr.ma` : "admin@cimr.ma"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profil</DropdownMenuItem>
          <DropdownMenuItem>Paramètres</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}