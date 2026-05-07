import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Data Engine — Shift Scheduler',
  description: 'Real-time shift attendance and station scheduling',
}

export const viewport: Viewport = {
  themeColor: '#0a0b0d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
