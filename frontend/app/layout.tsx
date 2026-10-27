import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'TechStore',
  description: 'Website thương mại điện tử đồ công nghệ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
