'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Search, User, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from './cart-provider'
import { IconButton, Drawer, Dialog, cn } from '@/components/ui'

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

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDarkHero = DARK_HERO_ROUTES.includes(pathname)
  // To prevent hydration mismatch, only use stateful triggers (scroll, menu) after mounting.
  const isSolid = !isDarkHero || (mounted && (isScrolled || isMobileMenuOpen || isSearchOpen))

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
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
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
                className={cn(
                  "font-garamond text-[15px] font-medium tracking-[0.1em] transition-[color] duration-200 relative group",
                  !isSolid ? 'hover:text-accent-on-dark' : 'hover:text-accent'
                )}
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
          
          <IconButton 
            className={cn(
              "md:hidden -ml-2 text-current hover:bg-transparent",
              !isSolid ? 'hover:text-accent-on-dark' : 'hover:text-accent'
            )}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="flex flex-col gap-[6px] w-5">
              <span className="h-[1px] w-full bg-current transition-transform duration-300" />
              <span className="h-[1px] w-full bg-current transition-transform duration-300" />
            </div>
          </IconButton>
        </div>

        {/* Center Zone: Wordmark */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center">
          <Link href="/" className="font-serif font-medium text-xl md:text-3xl tracking-widest uppercase no-underline flex items-center justify-center">
            TARAYA
          </Link>
        </div>

        {/* Right Zone: Utilities */}
        <div className="flex-1 flex items-center justify-end gap-4 md:gap-6">
          <IconButton 
            aria-label="Search" 
            className={cn(
              "hover:bg-transparent text-current",
              !isSolid ? 'hover:text-accent-on-dark' : 'hover:text-accent'
            )}
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={18} strokeWidth={1.5} />
          </IconButton>
          <IconButton aria-label="Account" className={cn("hidden md:flex hover:bg-transparent text-current", !isSolid ? 'hover:text-accent-on-dark' : 'hover:text-accent')}>
            <User size={18} strokeWidth={1.5} />
          </IconButton>
          <IconButton 
            aria-label="Cart" 
            className={cn(
              "relative hover:bg-transparent text-current -mr-2 md:mr-0",
              !isSolid ? 'hover:text-accent-on-dark' : 'hover:text-accent'
            )}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {isInitialized && totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-ink text-field text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-field">
                {totalItems}
              </span>
            )}
          </IconButton>
        </div>
      </motion.header>

      <Drawer
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Menu"
        hideTitle
      >
        <div className="flex flex-col h-full -mx-6 -mt-5 pt-8">
          <div className="flex items-center justify-center pb-12">
            <div className="font-serif font-medium text-lg tracking-widest uppercase text-ink">
              TARAYA
            </div>
          </div>

          <nav className="flex-1 flex flex-col items-center justify-center gap-10">
            {NAV_LINKS.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="font-serif text-4xl tracking-wide hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>
          
          <div className="pb-8 text-center">
            <p className="font-garamond text-muted text-sm" style={{ fontVariant: 'small-caps' }}>
              Made to be handed down
            </p>
          </div>
        </div>
      </Drawer>

      <Dialog
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search"
        hideTitle
      >
        <div className="py-8">
          <form onSubmit={handleSearchSubmit} className="w-full relative group">
            <input
              type="text"
              autoFocus
              placeholder="Search the collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-line pb-4 text-3xl md:text-5xl font-serif text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink transition-colors rounded-none"
            />
            <IconButton 
              type="submit"
              aria-label="Submit search"
              className="absolute right-0 bottom-2 text-muted hover:text-ink hover:bg-transparent"
            >
              <ArrowRight size={28} strokeWidth={1} />
            </IconButton>
          </form>
        </div>
      </Dialog>
    </>
  )
}
