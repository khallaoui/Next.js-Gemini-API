"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthTestPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}
          </div>
          <div>
            <strong>LocalStorage Auth:</strong> {typeof window !== 'undefined' ? localStorage.getItem('cimr-authenticated') : 'N/A'}
          </div>
          <div>
            <strong>LocalStorage User:</strong> {typeof window !== 'undefined' ? localStorage.getItem('cimr-user') : 'N/A'}
          </div>
          <Button onClick={logout} variant="destructive">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}