import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-xl px-3.5 text-sm text-fg outline-none',
        'bg-white/4 border border-white/10 hover:border-white/15 focus:border-neon-blue/40',
        'placeholder:text-fg-muted/70 transition-colors',
        className,
      )}
      {...props}
    />
  )
})

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full rounded-2xl px-4 py-3 text-sm text-fg outline-none resize-none',
        'bg-white/4 border border-white/10 hover:border-white/15 focus:border-neon-blue/40',
        'placeholder:text-fg-muted/70 transition-colors',
        className,
      )}
      {...props}
    />
  )
}
