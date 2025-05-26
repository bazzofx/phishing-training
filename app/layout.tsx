import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Phishing Training by Cyber Samurai',
  description: 'Developer by PB - A.K.A Cyber Samurai',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
