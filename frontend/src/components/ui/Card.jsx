import { cn } from '../../lib/cn'

export function Card({ className, tone = 'glass', ...props }) {
  const toneClass =
    tone === 'glass' ? 'glass noise' : tone === 'glass-strong' ? 'glass-strong noise' : 'hairline bg-card/30'
  return <div className={cn('rounded-2xl', toneClass, className)} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('px-5 pt-5 pb-3', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <div className={cn('text-sm font-semibold text-fg', className)} {...props} />
}

export function CardDescription({ className, ...props }) {
  return <div className={cn('text-xs text-fg-muted', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('px-5 pb-5', className)} {...props} />
}

