import type { ComponentProps } from 'react'
import { cn } from './cn'

export type ImagePlateSize = 'default' | 'thumb'

export interface ImagePlateProps extends ComponentProps<'div'> {
  /** Uses the dark vault ground if true, otherwise transparent */
  darkGround?: boolean
  /** Thumbnails have a smaller aspect ratio and different borders */
  size?: ImagePlateSize
}

/** 
 * Standardized container for product images. 
 * Enforces the aspect ratio, rounding, and dark ground logic.
 */
export function ImagePlate({ darkGround, size = 'default', className, children, ...props }: ImagePlateProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden flex items-center justify-center rounded-lg',
        size === 'default' ? 'aspect-[4/5]' : 'aspect-square',
        className
      )}
      style={{ 
        backgroundColor: darkGround ? 'var(--color-vault)' : 'transparent',
        ...props.style 
      }}
      {...props}
    >
      {children}
    </div>
  )
}
