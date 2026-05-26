import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X, ArrowUpRight, Wand2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card'

const promptByRoute = {
  '/': ['Summarize my day', 'What should I focus on next?', 'Spot risks in my schedule'],
  '/tasks': ['Prioritize my tasks', 'Suggest a plan for today', 'Turn this into a sprint'],
  '/goals': ['Break my goals into milestones', 'What should I do this week?', 'Identify blockers'],
  '/journal': ['Reflect on today', 'Find patterns in my mood', 'Give me a reframing exercise'],
  '/chat': ['Draft a message', 'Brainstorm', 'Ask anything'],
}

export function AssistantDock() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const prompts = useMemo(() => promptByRoute[location.pathname] ?? promptByRoute['/'], [location.pathname])

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="mb-3 w-[92vw] max-w-[360px]"
          >
            <Card tone="glass-strong" className="overflow-hidden">
              <CardHeader className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles size={16} className="text-neon-blue" />
                    PulseOS Assistant
                  </CardTitle>
                  <CardDescription>Quick prompts for your current context.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-9 w-9 px-0 rounded-2xl" onClick={() => setOpen(false)} aria-label="Close assistant">
                  <X size={16} />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-2">
                  {prompts.slice(0, 3).map((p) => (
                    <button
                      key={p}
                      onClick={() => navigate('/chat', { state: { draft: p } })}
                      className="text-left rounded-2xl border border-white/10 bg-white/4 hover:bg-white/6 hover:border-white/15 transition-all px-3 py-2.5"
                    >
                      <div className="text-sm text-fg">{p}</div>
                      <div className="text-[11px] text-fg-muted flex items-center gap-1">
                        <Wand2 size={12} />
                        Send to AI Chat
                      </div>
                    </button>
                  ))}
                </div>
                <Button variant="subtle" size="md" className="w-full justify-between" onClick={() => navigate('/chat')}>
                  Open AI Chat
                  <ArrowUpRight size={16} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Button
        size="lg"
        className="rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.18)]"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle assistant"
      >
        <Sparkles size={18} />
        <span className="hidden sm:inline">Assistant</span>
      </Button>
    </div>
  )
}

