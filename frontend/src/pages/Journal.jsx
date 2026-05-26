import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Calendar, Plus, Sparkles, Trash2 } from 'lucide-react'
import api from '../services/api'
import { Page, PageSubtitle, PageTitle } from '../components/ui/Page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { cn } from '../lib/cn'

const moods = [
  { key: 'calm', label: 'Calm', tone: 'blue' },
  { key: 'neutral', label: 'Neutral', tone: 'gray' },
  { key: 'sad', label: 'Low', tone: 'purple' },
  { key: 'anxious', label: 'Anxious', tone: 'amber' },
  { key: 'tired', label: 'Tired', tone: 'gray' },
  { key: 'excited', label: 'Energized', tone: 'green' },
]

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return ''
  }
}

export default function Journal() {
  const [journals, setJournals] = useState([])
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    api
      .get('/journal')
      .then(r => alive && setJournals(r.data ?? []))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const analytics = useMemo(() => {
    const total = journals.length
    const byMood = journals.reduce((acc, j) => {
      const k = j.mood || 'neutral'
      acc[k] = (acc[k] || 0) + 1
      return acc
    }, {})
    const topMood = Object.entries(byMood).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'neutral'
    return { total, byMood, topMood }
  }, [journals])

  const addEntry = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    try {
      const res = await api.post('/journal', { content: content.trim(), mood })
      setJournals(prev => [res.data, ...prev])
      setContent('')
      setMood('')
    } finally {
      setSaving(false)
    }
  }

  const deleteEntry = async (id) => {
    const prev = journals
    setJournals(journals.filter(j => j.id !== id))
    try {
      await api.delete(`/journal/${id}`)
    } catch {
      setJournals(prev)
    }
  }

  return (
    <Page>
      <div className="px-1 md:px-2">
        <div className="mb-6">
          <PageTitle>Journal</PageTitle>
          <PageSubtitle>Write beautifully. Track mood. Let AI turn reflection into clarity.</PageSubtitle>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 space-y-4">
            <Card tone="glass-strong">
              <CardHeader>
                <CardTitle>New Entry</CardTitle>
                <CardDescription>Minimal friction. Maximum signal.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addEntry} className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {moods.map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setMood((v) => (v === m.key ? '' : m.key))}
                        className={cn(
                          'rounded-full px-3 py-2 text-xs font-medium border transition-all',
                          mood === m.key ? 'border-neon-blue/35 bg-neon-blue/10 text-fg' : 'border-white/10 bg-white/4 text-fg-muted hover:bg-white/6',
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What’s on your mind today?"
                    rows={7}
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-fg-muted">
                      Tip: End with a single sentence describing what you’ll do next.
                    </div>
                    <Button type="submit" disabled={saving || !content.trim()}>
                      <Plus size={16} />
                      {saving ? 'Saving…' : 'Save'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emotion Analytics</CardTitle>
                <CardDescription>Lightweight signal — evolve this into deeper insights later.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                      <div className="text-xs text-fg-muted">Entries</div>
                      <div className="text-2xl font-semibold text-fg mt-1">{analytics.total}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                      <div className="text-xs text-fg-muted">Most common mood</div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="text-2xl font-semibold text-fg">{analytics.topMood}</div>
                        <Badge tone="purple">Trend</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>AI Reflection</CardTitle>
                    <CardDescription>Transform journaling into action-ready insights.</CardDescription>
                  </div>
                  <Badge tone="blue" className="gap-1">
                    <Sparkles size={12} />
                    Coming online
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-3xl border border-white/10 bg-white/3 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Brain size={18} className="text-neon-blue" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-fg">Reflection prompt</div>
                      <div className="text-sm text-fg-muted mt-1 leading-relaxed">
                        What pattern did you notice today — and what’s one small experiment you can run tomorrow?
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
                <CardDescription>Scroll your memory, beautifully.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                  </div>
                ) : journals.length ? (
                  journals.map((j, idx) => (
                    <motion.div
                      key={j.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * idx }}
                      className="rounded-3xl border border-white/10 bg-white/3 hover:bg-white/4 transition-colors p-4 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-xs text-fg-muted">
                            <Calendar size={14} />
                            <span>{fmtDate(j.createdAt)}</span>
                            {j.mood ? <Badge tone="gray">{j.mood}</Badge> : null}
                          </div>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          className="h-10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteEntry(j.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <div className="mt-3 text-sm text-fg leading-relaxed whitespace-pre-wrap">
                        {String(j.content ?? '')}
                      </div>

                      {j.summary ? (
                        <div className="mt-4 rounded-3xl border border-neon-blue/20 bg-neon-blue/8 p-4">
                          <div className="text-xs font-semibold text-neon-blue flex items-center gap-2">
                            <Sparkles size={14} />
                            AI Summary
                          </div>
                          <div className="mt-1 text-sm text-fg-muted leading-relaxed">{j.summary}</div>
                        </div>
                      ) : null}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-sm text-fg-muted">No entries yet. Write your first reflection to start a streak.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  )
}

