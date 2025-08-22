"use client"

import * as React from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const formSchema = z.object({
  username: z.string().min(1, { message: "Le nom d'utilisateur est requis." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
})

export function LoginFormDebug() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)
  const [debugInfo, setDebugInfo] = React.useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const addDebugInfo = (message: string) => {
    console.log(message)
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setDebugInfo([])
    
    try {
      addDebugInfo(`Attempting login with username: ${values.username}`)
      
      // Use the proper auth context login method
      const result = await login(values)
      addDebugInfo(`Login result: ${JSON.stringify(result)}`)
      
      if (result.success) {
        addDebugInfo(`Login successful for user: ${values.username}`)
        
        // Check localStorage after successful login
        const authState = localStorage.getItem('cimr-authenticated')
        const userInfo = localStorage.getItem('cimr-user')
        addDebugInfo(`LocalStorage auth state: ${authState}`)
        addDebugInfo(`LocalStorage user info: ${userInfo}`)
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${values.username}! Redirection vers le tableau de bord.`,
        })
        
        addDebugInfo('Redirecting to dashboard in 2 seconds...')
        
        // Add a delay to see the debug info
        setTimeout(() => {
          addDebugInfo('Executing router.push("/")...')
          router.push("/")
        }, 2000)
      } else {
        addDebugInfo(`Login failed: ${result.error}`)
        
        toast({
          variant: "destructive",
          title: "Échec de la connexion",
          description: result.error || "Nom d'utilisateur ou mot de passe invalide.",
        })
      }
    } catch (error) {
      addDebugInfo(`Login error: ${error}`)
      console.error('Login error:', error)
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d'utilisateur</FormLabel>
                <FormControl>
                  <Input placeholder="admin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Mot de passe</FormLabel>
                  <Link href="#" className="text-xs text-primary/90 hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="admin123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            Se connecter
          </Button>
        </form>
      </Form>
      
      {debugInfo.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <div className="text-sm space-y-1">
            {debugInfo.map((info, index) => (
              <div key={index} className="font-mono text-xs">{info}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}