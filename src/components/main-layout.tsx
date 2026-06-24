'use client'

import { usePathname } from 'next/navigation'

const DARK_HERO_ROUTES = ['/']

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDarkHero = DARK_HERO_ROUTES.includes(pathname)

  return (
    <main className={`flex-1 ${isDarkHero ? 'pt-0' : 'pt-[64px] md:pt-[64px]'}`}>
      {children}
    </main>
  )
}
