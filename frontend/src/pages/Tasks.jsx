import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, Plus, Search, Trash2, CheckCircle2, GripVertical } from 'lucide-react'
import api from '../services/api'
import { Page, PageSubtitle, PageTitle } from '../components/ui/Page'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { cn } from '../lib/cn'

const priorities = ['low', 'medium', 'high']

function toneForPriority(p) {
  if (p === 'high') return 'red'
  if (p === 'medium') return 'amber'
  return 'gray'
}

function columnForTask(t) {
  if (t.done) return 'done'
  return t.priority === 'high' ? 'focus' : 'backlog'
}

const columns = [
  { key: 'backlog', title: 'Backlog', desc: 'Queue for later', badgeTone: 'gray' },
  { key: 'focus', title: 'Focus', desc: 'High priority', badgeTone: 'purple' },
  { key: 'done', title: 'Done', desc: 'Shipped', badgeTone: 'green' },
]

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('medium')

  const [q, setQ] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const [dragId, setDragId] = useState(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    api
      .get('/tasks')
      .then(r => alive && setTasks(r.data ?? []))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return tasks.filter(t => {
      if (priorityFilter !== 'all' && (t.priority ?? 'medium') !== priorityFilter) return false
      if (!query) return true
      return String(t.title ?? '').toLowerCase().includes(query)
    })
  }, [tasks, q, priorityFilter])

  const byColumn = useMemo(() => {
    const map = { backlog: [], focus: [], done: [] }
    for (const t of filtered) map[columnForTask(t)].push(t)
    return map
  }, [filtered])

  const addTask = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setAdding(true)
    try {
      const res = await api.post('/tasks', { title: newTitle.trim(), priority: newPriority })
      setTasks(prev => [res.data, ...prev])
      setNewTitle('')
      setNewPriority('medium')
    } finally {
      setAdding(false)
    }
  }

  const updateTask = async (task, patch) => {
    const optimistic = { ...task, ...patch }
    setTasks(prev => prev.map(t => (t.id === task.id ? optimistic : t)))
    try {
      const res = await api.put(`/tasks/${task.id}`, optimistic)
      setTasks(prev => prev.map(t => (t.id === task.id ? res.data : t)))
    } catch {
      setTasks(prev => prev.map(t => (t.id === task.id ? task : t)))
    }
  }

  const deleteTask = async (id) => {
    const prev = tasks
    setTasks(tasks.filter(t => t.id !== id))
    try {
      await api.delete(`/tasks/${id}`)
    } catch {
      setTasks(prev)
    }
  }

  const onDropTo = (colKey) => {
    if (!dragId) return
    const task = tasks.find(t => t.id === dragId)
    if (!task) return

    if (colKey === 'done') {
      updateTask(task, { done: true })
    } else if (colKey === 'focus') {
      updateTask(task, { done: false, priority: 'high' })
    } else {
      updateTask(task, { done: false, priority: task.priority === 'high' ? 'medium' : (task.priority ?? 'medium') })
    }

    setDragId(null)
  }

  return (
    <Page>
      <div className="px-1 md:px-2">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <PageTitle>Tasks</PageTitle>
            <PageSubtitle>Kanban-grade focus with a premium OS feel.</PageSubtitle>
          </div>

          <form onSubmit={addTask} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add a task…"
              className="sm:w-[320px]"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="h-10 rounded-xl bg-white/4 border border-white/10 text-sm text-fg px-3 outline-none"
            >
              {priorities.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <Button type="submit" variant="primary" disabled={adding || !newTitle.trim()}>
              <Plus size={16} />
              Add
            </Button>
          </form>
        </div>

        <Card className="mb-4">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle>Command Filters</CardTitle>
              <CardDescription>Search, filter, and drag tasks across your life board.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks…" className="pl-9 sm:w-[320px]" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-white/4 border border-white/10 flex items-center justify-center">
                  <Filter size={16} className="text-fg-muted" />
                </div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="h-10 rounded-xl bg-white/4 border border-white/10 text-sm text-fg px-3 outline-none"
                >
                  <option value="all">All</option>
                  {priorities.map(p => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {columns.map((col, colIdx) => (
            <motion.div
              key={col.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * colIdx }}
              className="min-w-0"
            >
              <Card className="h-full">
                <CardHeader className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {col.title}
                      <Badge tone={col.badgeTone}>{byColumn[col.key]?.length ?? 0}</Badge>
                    </CardTitle>
                    <CardDescription>{col.desc}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDropTo(col.key)}
                    className={cn(
                      'rounded-2xl border border-dashed border-white/12 bg-white/2 p-2 min-h-[260px]',
                      dragId ? 'shadow-[0_0_0_1px_rgba(56,189,248,0.14),0_0_60px_rgba(56,189,248,0.06)]' : '',
                    )}
                  >
                    {loading ? (
                      <div className="space-y-2 p-2">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                      </div>
                    ) : byColumn[col.key]?.length ? (
                      <div className="space-y-2">
                        {byColumn[col.key].map((t) => (
                          <motion.div
                            key={t.id}
                            layout
                            whileHover={{ y: -2 }}
                            className={cn(
                              'group rounded-2xl border border-white/10 bg-white/4 hover:bg-white/6 transition-colors',
                              'px-3 py-3 cursor-grab active:cursor-grabbing',
                            )}
                            draggable
                            onDragStart={() => setDragId(t.id)}
                            onDragEnd={() => setDragId(null)}
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5 text-fg-muted">
                                <GripVertical size={16} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <div className={cn('text-sm text-fg truncate', t.done && 'line-through text-fg-muted')}>
                                    {t.title}
                                  </div>
                                  <Badge tone={toneForPriority(t.priority ?? 'medium')}>{t.priority ?? 'medium'}</Badge>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                  <button
                                    onClick={() => updateTask(t, { done: !t.done })}
                                    className="inline-flex items-center gap-1 text-[11px] text-fg-muted hover:text-fg transition-colors"
                                  >
                                    <CheckCircle2 size={14} />
                                    {t.done ? 'Mark open' : 'Mark done'}
                                  </button>
                                  <button
                                    onClick={() => deleteTask(t.id)}
                                    className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 text-[11px] text-red-200 hover:text-red-100 transition-all"
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-sm text-fg-muted">
                        Nothing here yet. Drag tasks into this column or create a new one above.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Page>
  )
}

