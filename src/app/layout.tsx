import type {Metadata} from 'next';
import { Inter, Lexend } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
})

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-headline',
})


export const metadata: Metadata = {
  title: 'Portail de Gestion CIMR',
  description: 'Portail de Gestion CIMR',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${lexend.variable} font-body antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}