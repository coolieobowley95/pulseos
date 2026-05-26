import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search, Sparkles, Plus, LogOut } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/cn'

const titles = {
  '/': { title: 'Dashboard', subtitle: 'Your life at a glance' },
  '/tasks': { title: 'Tasks', subtitle: 'Plan, focus, execute' },
  '/goals': { title: 'Goals', subtitle: 'Progress, milestones, momentum' },
  '/journal': { title: 'Journal', subtitle: 'Reflect with clarity' },
  '/chat': { title: 'AI Chat', subtitle: 'Your co-pilot for life' },
}

export function TopNav({ user, onOpenMobileSidebar, onOpenCommandPalette, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()

  const meta = useMemo(() => titles[location.pathname] ?? { title: 'PulseOS', subtitle: 'Life Operating System' }, [location.pathname])

  return (
    <header className="sticky top-0 z-40">
      <div className="px-3 pt-3">
        <div
          className={cn(
            'rounded-3xl glass border-white/12',
            'flex items-center gap-3 px-3 py-3',
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-10 w-10 px-0 rounded-2xl"
            onClick={onOpenMobileSidebar}
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </Button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-fg truncate">{meta.title}</div>
              <span className="hidden sm:inline text-xs text-fg-muted truncate">{meta.subtitle}</span>
            </div>
          </div>

          <Button
            variant="subtle"
            size="sm"
            className="h-10 rounded-2xl"
            onClick={onOpenCommandPalette}
          >
            <Search size={16} />
            <span className="hidden sm:inline">Search</span>
            <span className="hidden sm:inline text-[11px] text-fg-muted ml-1">Ctrl K</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 px-0 rounded-2xl"
            onClick={() => navigate('/chat')}
            aria-label="Open AI chat"
          >
            <Sparkles size={18} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex h-10 rounded-2xl"
            onClick={() => onOpenCommandPalette('create')}
          >
            <Plus size={16} />
            New
          </Button>

          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-neon-blue/80 to-neon-purple/80 flex items-center justify-center text-xs font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="hidden lg:block min-w-0">
              <div className="text-xs font-semibold text-fg truncate max-w-[160px]">{user?.name ?? 'User'}</div>
              <div className="text-[11px] text-fg-muted truncate max-w-[160px]">{user?.email ?? ''}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 px-0 rounded-2xl"
              onClick={onLogout}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

