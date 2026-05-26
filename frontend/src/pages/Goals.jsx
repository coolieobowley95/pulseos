import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, CalendarRange, Plus, Trash2, TrendingUp } from 'lucide-react'
import api from '../services/api'
import { Page, PageSubtitle, PageTitle } from '../components/ui/Page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { RingProgress } from '../components/ui/RingProgress'
import { Skeleton } from '../components/ui/Skeleton'
import { Sparkline } from '../components/ui/Sparkline'
import { cn } from '../lib/cn'

function goalPct(goal) {
  const target = Math.max(1, Number(goal.target ?? 100))
  const progress = Math.max(0, Number(goal.progress ?? 0))
  return Math.max(0, Math.min(100, (progress / target) * 100))
}

function milestonesFor(goal) {
  const pct = goalPct(goal)
  const steps = [25, 50, 75, 100]
  return steps.map((s) => ({ pct: s, done: pct >= s }))
}

function badgeFor(pct) {
  if (pct >= 100) return { label: 'Achieved', tone: 'green' }
  if (pct >= 75) return { label: 'On Track', tone: 'blue' }
  if (pct >= 40) return { label: 'Building', tone: 'purple' }
  return { label: 'Starting', tone: 'gray' }
}

export default function Goals() {
  const [goals, setGoals] = useState([])
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState(100)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    api
      .get('/goals')
      .then(r => alive && setGoals(r.data ?? []))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const addGoal = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setCreating(true)
    try {
      const res = await api.post('/goals', { title: title.trim(), target: Number(target) || 100 })
      setGoals(prev => [res.data, ...prev])
      setTitle('')
      setTarget(100)
    } finally {
      setCreating(false)
    }
  }

  const updateGoal = async (goal, patch) => {
    const optimistic = { ...goal, ...patch }
    setGoals(prev => prev.map(g => (g.id === goal.id ? optimistic : g)))
    try {
      const res = await api.put(`/goals/${goal.id}`, optimistic)
      setGoals(prev => prev.map(g => (g.id === goal.id ? res.data : g)))
    } catch {
      setGoals(prev => prev.map(g => (g.id === goal.id ? goal : g)))
    }
  }

  const deleteGoal = async (id) => {
    const prev = goals
    setGoals(goals.filter(g => g.id !== id))
    try {
      await api.delete(`/goals/${id}`)
    } catch {
      setGoals(prev)
    }
  }

  const avgPct = useMemo(() => {
    if (!goals.length) return 0
    return Math.round(goals.reduce((a, g) => a + goalPct(g), 0) / goals.length)
  }, [goals])

  return (
    <Page>
      <div className="px-1 md:px-2">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <PageTitle>Goals</PageTitle>
            <PageSubtitle>Milestones, momentum, and achievement-grade progress.</PageSubtitle>
          </div>

          <form onSubmit={addGoal} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New goal…" className="sm:w-[320px]" />
            <Input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              type="number"
              min="1"
              className="sm:w-[130px]"
              placeholder="Target"
            />
            <Button type="submit" disabled={creating || !title.trim()}>
              <Plus size={16} />
              Add
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Goal Analytics</CardTitle>
                <CardDescription>High-level view across all goals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[86%]" />
                    <Skeleton className="h-4 w-[72%]" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-fg-muted">Average progress</div>
                        <div className="text-2xl font-semibold text-fg tracking-tight">{avgPct}%</div>
                      </div>
                      <RingProgress value={avgPct} size={64} stroke={7} label="Avg" />
                    </div>
                    <Progress value={avgPct} />
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-fg flex items-center gap-2">
                          <TrendingUp size={16} className="text-neon-blue" />
                          Momentum
                        </div>
                        <Badge tone={avgPct >= 70 ? 'green' : avgPct >= 40 ? 'purple' : 'gray'}>
                          {avgPct >= 70 ? 'Strong' : avgPct >= 40 ? 'Rising' : 'Early'}
                        </Badge>
                      </div>
                      <div className="text-xs text-fg-muted mt-1">
                        Track weekly outcomes, not just intent. Small consistent moves beat spikes.
                      </div>
                      <div className="mt-3">
                        <Sparkline data={[8, 10, 14, 13, 18, 24, 28]} className="w-full" width={240} height={38} />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Goals</CardTitle>
                <CardDescription>Adjust progress and unlock achievement badges.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                  </div>
                ) : goals.length ? (
                  goals.map((g, idx) => {
                    const pct = goalPct(g)
                    const badge = badgeFor(pct)
                    const milestones = milestonesFor(g)
                    return (
                      <motion.div
                        key={g.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.03 * idx }}
                        className="rounded-3xl border border-white/10 bg-white/3 hover:bg-white/4 transition-colors p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-semibold text-fg truncate">{g.title}</div>
                              <Badge tone={badge.tone}>{badge.label}</Badge>
                            </div>
                            <div className="text-xs text-fg-muted mt-1">
                              {Number(g.progress ?? 0)} / {Number(g.target ?? 100)} ({Math.round(pct)}%)
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <RingProgress value={pct} size={56} stroke={7} label="Goal" />
                            <Button variant="danger" size="sm" className="h-10" onClick={() => deleteGoal(g.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Progress value={pct} />
                        </div>

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {milestones.map((m) => (
                            <div
                              key={m.pct}
                              className={cn(
                                'rounded-2xl border px-3 py-2.5',
                                m.done ? 'border-neon-blue/25 bg-neon-blue/10' : 'border-white/10 bg-white/3',
                              )}
                            >
                              <div className="text-[11px] text-fg-muted flex items-center gap-1">
                                <CalendarRange size={12} />
                                Milestone
                              </div>
                              <div className="text-sm font-semibold text-fg mt-0.5">{m.pct}%</div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4">
                          <div className="text-xs text-fg-muted flex items-center gap-1">
                            <Award size={14} />
                            Achievement: {badge.label}
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={Math.max(1, Number(g.target ?? 100))}
                            value={Number(g.progress ?? 0)}
                            onChange={(e) => updateGoal(g, { progress: Number(e.target.value) })}
                            className="w-[52%]"
                            style={{ accentColor: 'rgb(var(--neon-blue))' }}
                          />
                        </div>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="text-sm text-fg-muted">No goals yet. Add one and start tracking milestones.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  )
}

