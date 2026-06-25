'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE_OUT } from '@/components/motion-transitions'
import { ButtonLink } from '@/components/ui'

const images = [
  '/assets/marble-photoframe.png',
  '/assets/silver-elephant.png',
  '/assets/silver-ganesha.png',
  '/assets/silver-ganesha-2.png',
  '/assets/idolize.png'
]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-ink -mt-20 flex flex-col justify-center items-center">
      
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: EASE_OUT }}
          >
            <Image
              src={images[currentIndex]}
              alt="Taraya Collection"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 z-0 bg-gradient-to-t from-ink via-ink/20 to-transparent pointer-events-none" />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none text-center px-6 max-w-5xl mx-auto pt-10">
        
        {/* Main Title */}
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-medium leading-snug text-field mb-16 font-serif drop-shadow-md tracking-wide"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          Premium collections of{' '}
          <span className="relative inline-block">
            bullions & silver
            <motion.span
              className="absolute bottom-1 left-0 right-0 h-0.5 bg-field"
              initial={{ transform: "scaleX(0)" }}
              animate={{ transform: "scaleX(1)" }}
              style={{ originX: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.8 }}
            />
          </span>
          <br/>and semi-precious frames.
        </motion.h1>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center pointer-events-auto"
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.6 }}
        >
          <ButtonLink
            href="/collections"
            variant="secondary"
            className="shadow-sm bg-field/10 backdrop-blur-md text-field border-field/20 hover:bg-field/20"
          >
            Explore Collections
          </ButtonLink>
        </motion.div>

      </div>
    </section>
  )
}
