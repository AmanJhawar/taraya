import type { Metadata, Viewport } from 'next'

import './globals.css'
import SiteHeader from '@/components/site-header'
import MainLayout from '@/components/main-layout'
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
  description: 'Silver idols, auspicious animals, coins and bars, with stone-set frames. Made to be handed down.',
  icons: {
    icon: '/favicon.svg',
  },

  openGraph: {
    title: 'Taraya',
    description: 'Silver idols, auspicious animals, coins and bars, with stone-set frames. Made to be handed down.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Taraya',
    description: 'Silver idols, auspicious animals, coins and bars, with stone-set frames. Made to be handed down.',
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ECE6DC' },
    { media: '(prefers-color-scheme: dark)', color: '#2B2723' }
  ]
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
          <SiteHeader />
          <CartDrawer />
          <MainLayout>
            {children}
          </MainLayout>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
