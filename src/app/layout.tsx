import type {Metadata} from 'next';
import { Inter, Lexend } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
})

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-headline',
})


export const metadata: Metadata = {
  title: 'CIMR Insights',
  description: 'Portail de Gestion CIMR',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lexend.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
