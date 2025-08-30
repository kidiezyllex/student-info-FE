import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
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

// Clerk configuration
const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_ZGFybGluZy10cm9sbC05LmNsZXJrLmFjY291bnRzLmRldiQ"
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "sk_test_mXL441JEPmSTFYRCsoGc98kKMHjfjKjtVnl3VSBxC9"

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
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
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
    </ClerkProvider>
  )
}
