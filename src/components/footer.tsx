import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-band">
      <div className="max-w-8xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-center gap-12 md:gap-32 mb-16 text-center">
          <div>
            <h3 className="text-sm font-semibold tracking-widest text-ink mb-6 uppercase">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted hover:text-ink transition-[color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.97] inline-block">About Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-widest text-ink mb-6 uppercase">Store</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/catalog" className="text-sm text-muted hover:text-ink transition-[color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.97] inline-block">Catalog</Link>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="text-sm font-semibold tracking-widest text-ink mb-6 uppercase">Contact</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-sm text-muted hover:text-ink transition-[color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.97] inline-block">Get in Touch</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-line gap-6 text-center">
          <div className="flex items-center justify-center">
            <Image src="/assets/logo.png" alt="Taraya" width={100} height={30} className="w-auto h-4 object-contain grayscale opacity-50" />
          </div>
          <div className="text-sm text-muted">
            © {currentYear} Taraya, a brand by A96 Ventures Private Limited. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
