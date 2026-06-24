import { Metadata } from 'next'
import Image from 'next/image'
import { StaggerContainer, FadeInUp } from '@/components/motion-transitions'
import { getMakingStages } from '@/lib/services/the-making.service'

export const metadata: Metadata = {
  title: 'From Sketch to Silver | Taraya',
  description: 'An editorial narrative tracking one idol from sketch to finished silver.',
}

function StarDivider() {
  return (
    <div className="w-full flex justify-center py-24">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1 L13.7 10.3 L23 12 L13.7 13.7 L12 23 L10.3 13.7 L1 12 L10.3 10.3 Z" fill="#a89e93" />
      </svg>
    </div>
  )
}

export default async function TheMakingPage() {
  const makingStages = await getMakingStages()

  return (
    <main className="bg-field min-h-[calc(100vh-160px)]">
      <StaggerContainer>
        {/* Opening Statement */}
        <section className="pt-32 pb-24 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
          <FadeInUp>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-ink tracking-tight mb-8">
              From Sketch to Silver
            </h1>
            <p className="text-2xl md:text-3xl text-muted font-serif max-w-2xl mx-auto leading-relaxed italic">
              The meticulous journey of a single idol.
            </p>
          </FadeInUp>
        </section>

        {/* Narrative Sequence */}
        <div className="px-6 md:px-12 max-w-[1400px] mx-auto pb-32">
          {makingStages.map((stage, index) => {
            const isImageRight = index % 2 === 0;

            return (
              <div key={stage.id}>
                {index > 0 && <StarDivider />}

                <section className="flex flex-col md:flex-row items-center gap-16 md:gap-24 lg:gap-32">
                  {/* Text Column */}
                  <div className={`w-full md:w-1/2 flex flex-col ${isImageRight ? 'md:order-1' : 'md:order-2'}`}>
                    <FadeInUp yOffset={24}>
                      <div className="max-w-[34rem]">
                        <span className="block text-[13px] font-garamond [font-variant:small-caps] tracking-[0.1em] text-muted mb-4">
                          Stage {stage.numberLabel}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif text-ink mb-6">
                          {stage.title}
                        </h2>
                        <p className="text-lg text-ink font-garamond leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    </FadeInUp>
                  </div>

                  {/* Image Column */}
                  <div className={`w-full md:w-1/2 ${isImageRight ? 'md:order-2' : 'md:order-1'}`}>
                    <FadeInUp duration={0.6} yOffset={40} className="w-full">
                      <div 
                        className={`relative w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-lg flex items-center justify-center ${
                          stage.isDarkPlate ? 'bg-[#2B2723]' : 'bg-field'
                        }`}
                      >
                        <Image
                          src={stage.imagePath}
                          alt={stage.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out)] hover:scale-105"
                          priority={index < 2}
                        />
                      </div>
                    </FadeInUp>
                  </div>
                </section>
              </div>
            )
          })}
        </div>

        {/* Final Reveal */}
        <section className="w-full bg-[#2B2723] py-40 px-6 text-center">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-field tracking-wide">
              Made to be handed down.
            </h2>
          </FadeInUp>
        </section>
      </StaggerContainer>
    </main>
  )
}
