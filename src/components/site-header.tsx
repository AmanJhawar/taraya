'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { Search, User, ShoppingBag, X, ArrowRight } from 'lucide-react'
import { useCart } from './cart-provider'

const NAV_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'The Making', href: '/the-making' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const DARK_HERO_ROUTES = ['/']

export default function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { cartItems, setIsCartOpen, isInitialized } = useCart()
  
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { scrollY } = useScroll()

  const isDarkHero = DARK_HERO_ROUTES.includes(pathname)
  // If we have an open menu or search, the header must be solid so it matches the background.
  const isSolid = !isDarkHero || isScrolled || isMobileMenuOpen || isSearchOpen

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    
    // Background transition threshold
    if (latest > 50) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }

    // Hide/Show threshold
    if (latest > previous && latest > 200 && !isMobileMenuOpen && !isSearchOpen) {
      setIsHidden(true)
    } else if (latest < previous || latest < 50) {
      setIsHidden(false)
    }
  })

  // Lock body scroll when mobile menu or search is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen, isSearchOpen])

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    setSearchQuery('')
  }, [pathname])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setIsSearchOpen(false)
    router.push(`/collections?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 md:h-16 border-b transition-colors duration-300"
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' }
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        style={{
          backgroundColor: isSolid ? 'var(--color-field)' : 'transparent',
          borderColor: isSolid ? 'var(--color-line)' : 'transparent',
          color: isSolid ? 'var(--color-ink)' : 'var(--color-field)',
        }}
      >
        {/* Left Zone: Desktop Nav / Mobile Hamburger */}
        <div className="flex-1 flex items-center justify-start">
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-garamond text-[13px] tracking-[0.1em] transition-[color] duration-200 hover:text-accent relative group"
                style={{ fontVariant: 'small-caps' }}
                aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              >
                {link.label}
                {pathname.startsWith(link.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-current" />
                )}
              </Link>
            ))}
          </nav>
          
          <button 
            className="md:hidden p-2 -ml-2 text-current"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="flex flex-col gap-[6px] w-5">
              <span className="h-[1px] w-full bg-current transition-transform duration-300" />
              <span className="h-[1px] w-full bg-current transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* Center Zone: Wordmark */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center">
          <Link href="/" className="font-serif font-medium text-xl md:text-2xl tracking-widest uppercase no-underline flex items-center justify-center">
            TARAYA
          </Link>
        </div>

        {/* Right Zone: Utilities */}
        <div className="flex-1 flex items-center justify-end gap-4 md:gap-6">
          <button 
            aria-label="Search" 
            className="hover:text-accent transition-colors"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button aria-label="Account" className="hidden md:block hover:text-accent transition-colors">
            <User size={18} strokeWidth={1.5} />
          </button>
          <button 
            aria-label="Cart" 
            className="relative hover:text-accent transition-colors p-2 -mr-2 md:p-0 md:mr-0"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {isInitialized && totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-ink text-field text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-field">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </motion.header>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-field text-ink flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-6 h-14 border-b border-line">
              <button 
                className="p-2 -ml-2 text-ink hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
              <div className="font-serif font-medium text-lg tracking-widest uppercase text-ink">
                TARAYA
              </div>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>

            <nav className="flex-1 flex flex-col items-center justify-center gap-10">
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="font-serif text-4xl tracking-wide hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <div className="pb-12 text-center">
              <p className="font-garamond text-muted text-sm" style={{ fontVariant: 'small-caps' }}>
                Made to be handed down
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-field/95 backdrop-blur-sm text-ink flex flex-col"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-6 h-14 md:h-16">
              <div className="w-10" /> {/* Spacer */}
              <div className="font-serif font-medium text-lg tracking-widest uppercase text-ink invisible">
                SEARCH
              </div>
              <button 
                className="p-2 -mr-2 text-ink hover:text-accent transition-colors"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
              <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl relative group">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search the collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-line pb-4 text-3xl md:text-5xl font-serif text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors rounded-none"
                />
                <button 
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-0 bottom-4 text-muted hover:text-ink transition-colors"
                >
                  <ArrowRight size={28} strokeWidth={1} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
