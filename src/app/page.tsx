import type { Metadata } from 'next'
import Link from 'next/link'
import UnicornHero from '@/components/UnicornHero'

export const metadata: Metadata = {
  title: 'Taraya | Bullions & Silver Articles',
  description: 'Premium e-commerce store for bullions, silver articles, and semi-precious frames.',
}

export default async function Home() {

  const yearsExp = new Date().getFullYear() - 2017

  return (
    <>
      <UnicornHero />



      {/* Stats Section */}
      <section className="py-20 md:py-32 bg-transparent">
        <div className="max-w-8xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 md:gap-12">

            <div className="block text-center p-8">
              <div className="text-4xl md:text-5xl font-bold leading-none text-ink py-8 font-serif">{yearsExp}+</div>
              <div className="text-base text-muted">Years of Experience</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
