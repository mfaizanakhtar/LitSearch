import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from './context/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Litsearch',
  description: 'Literature Search Manager',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <html className="h-full bg-white" lang="en">
      <body className={inter.className.concat(" h-full")}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
    </>
  )
}
