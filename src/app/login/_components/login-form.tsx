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
import { auth } from "@/lib/auth"

const formSchema = z.object({
  username: z.string().min(1, { message: "Le nom d'utilisateur est requis." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
})

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    
    try {
      const result = await auth.login(values)
      
      if (result.success) {
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${result.user?.username}! Redirection vers le tableau de bord.`,
        })
        router.push("/")
      } else {
        toast({
          variant: "destructive",
          title: "Échec de la connexion",
          description: result.error || "Nom d'utilisateur ou mot de passe invalide.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion. Vérifiez que le serveur est démarré.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
  )
}
