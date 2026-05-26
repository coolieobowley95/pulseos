import { cn } from '../../lib/cn'

const tones = {
  blue: 'bg-neon-blue/12 text-neon-blue border-neon-blue/25',
  purple: 'bg-neon-purple/12 text-neon-purple border-neon-purple/25',
  green: 'bg-emerald-500/12 text-emerald-200 border-emerald-500/25',
  amber: 'bg-amber-500/12 text-amber-200 border-amber-500/25',
  red: 'bg-red-500/12 text-red-200 border-red-500/25',
  gray: 'bg-white/5 text-fg-muted border-white/10',
}

export function Badge({ className, tone = 'gray', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] leading-none font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}

