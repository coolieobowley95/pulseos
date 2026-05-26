import { cn } from '../../lib/cn'

export function Page({ className, ...props }) {
  return <div className={cn('mx-auto w-full max-w-[1200px]', className)} {...props} />
}

export function PageTitle({ className, ...props }) {
  return <h1 className={cn('text-xl md:text-2xl font-semibold text-fg tracking-tight', className)} {...props} />
}

export function PageSubtitle({ className, ...props }) {
  return <p className={cn('text-sm text-fg-muted mt-1', className)} {...props} />
}

