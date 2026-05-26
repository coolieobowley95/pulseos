import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Sparkles, CheckSquare, Target, BookOpen, LayoutGrid, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'

const baseItems = [
  { label: 'Dashboard', to: '/', icon: LayoutGrid, kind: 'nav' },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare, kind: 'nav' },
  { label: 'Goals', to: '/goals', icon: Target, kind: 'nav' },
  { label: 'Journal', to: '/journal', icon: BookOpen, kind: 'nav' },
  { label: 'AI Chat', to: '/chat', icon: Sparkles, kind: 'nav' },
  { label: 'New task', to: '/tasks', icon: Plus, kind: 'create', hint: 'add' },
  { label: 'New goal', to: '/goals', icon: Plus, kind: 'create', hint: 'add' },
  { label: 'New journal entry', to: '/journal', icon: Plus, kind: 'create', hint: 'write' },
  { label: 'New chat', to: '/chat', icon: Plus, kind: 'create', hint: 'start' },
]

export function CommandPalette({ open, mode, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setQuery('')
    const t = setTimeout(() => inputRef.current?.focus(), 10)
    return () => clearTimeout(t)
  }, [open])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = baseItems.filter(i => {
      if (mode === 'create' && i.kind !== 'create') return false
      if (mode !== 'create' && i.kind === 'create') return true
      return true
    })
    if (!q) return filtered
    return filtered.filter(i => i.label.toLowerCase().includes(q))
  }, [query, mode])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 10, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="absolute left-1/2 top-[12vh] -translate-x-1/2 w-[92vw] max-w-[720px]"
          >
            <div className="rounded-3xl glass-strong overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Search size={18} className="text-fg-muted" />
                </div>
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={mode === 'create' ? 'Create…' : 'Search PulseOS…'}
                    className="h-11 rounded-2xl bg-white/3"
                  />
                </div>
                <Badge tone="gray" className="hidden sm:inline-flex">
                  Esc
                </Badge>
              </div>

              <div className="max-h-[52vh] overflow-auto p-2">
                {items.length === 0 ? (
                  <div className="p-6 text-sm text-fg-muted">No results.</div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {items.map((it) => (
                      <button
                        key={`${it.kind}-${it.label}`}
                        onClick={() => {
                          navigate(it.to)
                          onClose()
                        }}
                        className={cn(
                          'w-full text-left flex items-center gap-3 rounded-2xl px-3 py-3',
                          'hover:bg-white/6 border border-transparent hover:border-white/10 transition-all',
                        )}
                      >
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <it.icon size={18} className="text-fg-muted" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-fg truncate">{it.label}</div>
                          <div className="text-[11px] text-fg-muted truncate">
                            {it.kind === 'create' ? 'Quick action' : 'Navigate'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {it.kind === 'create' ? <Badge tone="purple">Create</Badge> : <Badge tone="blue">Go</Badge>}
                          <ArrowRight size={16} className="text-fg-muted" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-white/10 flex items-center justify-between text-[11px] text-fg-muted">
                <div>Tip: Press Ctrl K anywhere.</div>
                <div className="hidden sm:block">PulseOS Command</div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

