"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DebugPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [localStorageData, setLocalStorageData] = useState<any>({})

  useEffect(() => {
    // Update localStorage data every second
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        setLocalStorageData({
          'cimr-authenticated': localStorage.getItem('cimr-authenticated'),
          'cimr-user': localStorage.getItem('cimr-user'),
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const clearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Debug Authentication</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Auth Context State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
            <div><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
            <div><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LocalStorage Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><strong>cimr-authenticated:</strong> {localStorageData['cimr-authenticated'] || 'null'}</div>
            <div><strong>cimr-user:</strong> {localStorageData['cimr-user'] || 'null'}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
          <Button onClick={clearStorage} variant="outline">
            Clear All Storage
          </Button>
          <Button onClick={() => router.push('/login')} variant="secondary">
            Go to Login
          </Button>
          <Button onClick={() => router.push('/')} variant="default">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Browser Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}</div>
          <div><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
          <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
        </CardContent>
      </Card>
    </div>
  )
}