import type { Metadata } from 'next'
import { StaggerContainer, FadeInUp } from '@/components/motion-transitions'

export const metadata: Metadata = {
  title: 'Our Heritage | Taraya',
  description: 'Silver idols, auspicious animals, coins and bars, with frames cut from stone. Handcrafted by Taraya, made to be handed down.',
  openGraph: {
    title: 'Our Heritage | Taraya',
    description: 'Silver idols, auspicious animals, coins and bars, with frames cut from stone. Handcrafted by Taraya, made to be handed down.',
  },
  twitter: {
    title: 'Our Heritage | Taraya',
    description: 'Silver idols, auspicious animals, coins and bars, with frames cut from stone. Handcrafted by Taraya, made to be handed down.',
  }
}

// The brand mark, reused as the section break
function StarDivider() {
  return (
    <FadeInUp className="w-full flex justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#a89e93" aria-hidden="true">
        <path d="M12 1 L13.7 10.3 L23 12 L13.7 13.7 L12 23 L10.3 13.7 L1 12 L10.3 10.3 Z" />
      </svg>
    </FadeInUp>
  )
}

export default function About() {
  return (
    <div className="pt-16 pb-24 min-h-screen bg-field selection:bg-ink selection:text-white">
      <div className="max-w-4xl mx-auto px-6">

        <StaggerContainer className="flex flex-col items-center justify-center space-y-16 md:space-y-20">

          {/* Hero */}
          <FadeInUp className="w-full text-center">
            <p className="font-garamond font-normal text-xs uppercase tracking-[0.3em] text-muted mb-6 md:mb-8">
              Our Heritage
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-ink leading-[1.25] tracking-tight max-w-3xl mx-auto">
              A silver idol is the centre a home is built around.
            </h1>
          </FadeInUp>

          {/* First Block */}
          <FadeInUp className="w-full max-w-xl text-left space-y-8">
            <p className="text-lg md:text-xl text-ink font-garamond font-light leading-relaxed">
              The lamp lit at dawn and dusk. The family gathered before it. The festivals turning through the year. It is the still point they return to, where the formless is given a form you can stand before, bathe, dress and pass to your children.
            </p>
            <p className="text-xl md:text-2xl font-serif italic text-ink leading-snug">
              A home does not fully feel like home until something sacred has a place in it.
            </p>
          </FadeInUp>

          <StarDivider />

          {/* Second Block */}
          <FadeInUp className="w-full max-w-xl text-left space-y-8">
            <p className="text-lg md:text-xl text-ink font-garamond font-normal leading-relaxed">
              Taraya makes that centre in silver, the metal of presence. It catches the lamp-flame at aarti and throws it back. Tended by the hands that pray before it, it only grows brighter with the years. The idol. The auspicious animals beside it. The coin and the bar, wealth that blesses, set aside for the hands that come after. Silver is how a family keeps the sacred close, its prosperity with it.
            </p>
            <p className="text-lg md:text-xl text-ink font-garamond font-normal leading-relaxed">
              And where memory asks to be held, the frame, cut from stone, each chosen for the way it holds the light.
            </p>
          </FadeInUp>

          <StarDivider />

          {/* Third Block */}
          <FadeInUp className="w-full max-w-xl text-left">
            <p className="text-lg md:text-xl text-ink font-garamond font-normal leading-relaxed">
              Behind all of it is the oldest skill India has: hands that coax the divine out of metal and give a keepsake the weight of an heirloom. For centuries they have called the sacred into form. Taraya carries that lineage forward.
            </p>
          </FadeInUp>

          {/* Conceptual peak */}
          <FadeInUp className="w-full max-w-3xl text-center pt-4">
            <h2 className="text-2xl md:text-4xl font-serif font-medium text-ink leading-[1.3] tracking-tight">
              A family’s idol is the fixed star it keeps its bearings by, the way travellers once kept theirs by the single light that held still. Everything else a home keeps orbits that centre.
            </h2>
          </FadeInUp>

          {/* Close */}
          <FadeInUp className="w-full flex flex-col items-center text-center space-y-12 pt-4">
            <p className="text-lg md:text-xl text-ink font-garamond font-normal leading-relaxed text-left max-w-xl">
              The idol a grandmother lights her lamp before, worn soft by decades of touch, is the one that will one day stand on her granddaughter’s shelf.
            </p>
            <p className="text-2xl md:text-3xl font-serif text-ink leading-snug">
              None of it is made for a season.<br />
              <span className="italic">It is made to be handed down.</span>
            </p>
          </FadeInUp>

        </StaggerContainer>
      </div>
    </div>
  )
}
