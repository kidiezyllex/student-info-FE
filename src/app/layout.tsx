import { type Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import './font.css'
import { ToastProvider } from '@/provider/ToastProvider'
import { ReactQueryClientProvider } from '@/provider/ReactQueryClientProvider'
import { UserProvider } from '@/context/useUserContext'

const openSans = Open_Sans({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-opensans',
})

export const metadata: Metadata = {
  title: 'Student Info System',
  description: 'Student Information Management System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={openSans.className}>
      <body className="bg-mainBackgroundV1 min-h-screen">
        <ReactQueryClientProvider>
          <UserProvider>
            <ToastProvider />
            {children}
          </UserProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  )
}
