'use client'

import { useCart } from './cart-provider'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { ProtectedImage } from './protected-image'
import { EmptyState, Drawer, ImagePlate, ButtonLink } from '@/components/ui'
import { getOptimizedUrl } from '@/lib/utils'

export function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, isInitialized } = useCart()

  if (!isInitialized) return null

  return (
    <Drawer
      open={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      title="Your Inquiry"
      footer={
        cartItems.length > 0 ? (
          <ButtonLink
            href="/contact?fromCart=true"
            onClick={() => setIsCartOpen(false)}
            fullWidth
            rightIcon={<ArrowRight size={18} />}
            className="justify-between"
          >
            Inquire About Items
          </ButtonLink>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-6">
        {cartItems.length === 0 ? (
          <EmptyState
            title="Your inquiry is empty."
            icon={<ShoppingBag size={32} strokeWidth={1} />}
            action={
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-sm font-medium text-ink underline underline-offset-4 transition-transform active:scale-[0.97]"
              >
                Continue Browsing
              </button>
            }
          />
        ) : (
          cartItems.map((item) => (
            <div key={item.cartId} className="flex gap-4 items-start">
              <ImagePlate size="thumb" className="w-16 bg-band border border-line flex-shrink-0 relative">
                <ProtectedImage
                  src={getOptimizedUrl(item.imageFile, 400)}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                  containerClassName="absolute inset-0"
                />
              </ImagePlate>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm line-clamp-2 pr-4 text-ink">{item.productName}</h3>
                </div>

                <div className="flex flex-col mt-0.5 text-[13px] text-muted leading-snug">
                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  {item.selectedPurity && <span>Purity: {item.selectedPurity}%</span>}
                  {item.selectedStone && <span>Stone: {item.selectedStone}</span>}
                  {item.selectedWeight ? (
                    <span>Weight: {item.selectedWeight}</span>
                  ) : (
                    item.weight && (
                      <span>
                        Approx Weight: {item.weight.toLowerCase().endsWith('g') || item.weight.toLowerCase().endsWith('kg') ? item.weight : `${item.weight}g`}
                      </span>
                    )
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="relative">
                    <select
                      value={item.quantity}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value, 10);
                        updateQuantity(item.cartId, newQty - item.quantity);
                      }}
                      className="appearance-none bg-field border border-line hover:border-line rounded-lg py-1 pl-3 pr-8 text-[13px] font-medium text-ink focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-[13px] text-muted hover:text-ink hover:underline underline-offset-4 transition-colors active:scale-[0.97]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  )
}
