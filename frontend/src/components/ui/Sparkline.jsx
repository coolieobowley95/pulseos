import { cn } from '../../lib/cn'

export function Sparkline({ data = [], className, stroke = 'url(#pulseSpark)', height = 32, width = 120 }) {
  const points = data.length ? data : [2, 3, 2, 4, 3, 5, 4]
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = Math.max(1, max - min)

  const d = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * width
      const y = height - ((v - min) / range) * height
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')

  return (
    <svg className={cn('overflow-visible', className)} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="pulseSpark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(var(--neon-blue))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="rgb(var(--neon-purple))" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

