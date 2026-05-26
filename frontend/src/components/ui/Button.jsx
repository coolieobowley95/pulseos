import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-gradient-to-br from-neon-blue/90 to-neon-purple/90 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_12px_40px_rgba(56,189,248,0.12)] hover:from-neon-blue hover:to-neon-purple',
  ghost:
    'bg-white/0 text-fg hover:bg-white/5 border border-white/10 hover:border-white/15',
  subtle:
    'bg-white/5 text-fg hover:bg-white/7 border border-white/10',
  danger:
    'bg-red-500/12 text-red-200 hover:bg-red-500/16 border border-red-500/25',
}

const sizes = {
  sm: 'h-9 px-3 text-sm rounded-xl',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-11 px-4.5 text-sm rounded-2xl',
}

export const Button = forwardRef(function Button(
  { className, variant = 'primary', size = 'md', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all outline-none',
        'focus-visible:ring-2 focus-visible:ring-neon-blue/60 focus-visible:ring-offset-0',
        'disabled:opacity-45 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
})

