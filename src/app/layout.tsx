import type { Metadata } from 'next'

import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

import { Cormorant, EB_Garamond } from 'next/font/google'

const cormorant = Cormorant({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
})

const garamond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-garamond',
  weight: ['400', '500', '600', '700', '800'],
})

import { CartProvider } from '@/components/cart-provider'
import { CartDrawer } from '@/components/cart-drawer'

export const metadata: Metadata = {
  metadataBase: new URL('https://taraya.com'),
  title: 'Taraya',
  description: 'Early-stage venture capital focused on transformative technologies and exceptional founders.',
  icons: {
    icon: '/assets/favicon.svg',
  },

  openGraph: {
    title: 'Taraya',
    description: 'Early-stage venture capital focused on transformative technologies and exceptional founders.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Taraya',
    description: 'Early-stage venture capital focused on transformative technologies and exceptional founders.',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${cormorant.variable} ${garamond.variable} min-h-screen flex flex-col text-ink bg-field antialiased`}>
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
