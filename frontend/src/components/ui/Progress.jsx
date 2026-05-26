import { cn } from '../../lib/cn'

export function Progress({ value = 0, className, ...props }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('h-2 rounded-full bg-white/6 border border-white/10 overflow-hidden', className)} {...props}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-neon-blue/90 to-neon-purple/90"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

