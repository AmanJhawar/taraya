import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Taraya',
  description: 'Get in touch with Taraya for inquiries, press, and startup pitches.',
  openGraph: {
    title: 'Contact | Taraya',
    description: 'Get in touch with Taraya for inquiries, press, and startup pitches.',
  },
  twitter: {
    title: 'Contact | Taraya',
    description: 'Get in touch with Taraya for inquiries, press, and startup pitches.',
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
