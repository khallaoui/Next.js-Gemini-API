"use client"

import * as React from "react"
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

export function LoginFormSimple() {
  const router = useRouter()
  const { toast } = useToast()
  const { login, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log('LoginForm: User is authenticated, redirecting to dashboard')
      router.push("/")
    }
  }, [isAuthenticated, router])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log('LoginForm: Attempting login for:', values.username)
    
    try {
      const result = await login(values)
      
      if (result.success) {
        console.log('LoginForm: Login successful')
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${values.username}!`,
        })
        
        // Wait a moment for state to update, then redirect
        setTimeout(() => {
          console.log('LoginForm: Redirecting to dashboard')
          router.push("/")
        }, 500)
      } else {
        console.log('LoginForm: Login failed:', result.error)
        toast({
          variant: "destructive",
          title: "Échec de la connexion",
          description: result.error || "Nom d'utilisateur ou mot de passe invalide.",
        })
      }
    } catch (error) {
      console.error('LoginForm: Login error:', error)
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
                </div>
                <FormControl>
                  <Input type="password" placeholder="admin123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter
          </Button>
        </form>
      </Form>
      
    
    </div>
  )
}