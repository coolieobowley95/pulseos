import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Sidebar, MobileSidebar } from './shell/Sidebar'
import { TopNav } from './shell/TopNav'
import { CommandPalette } from './shell/CommandPalette'
import { AssistantDock } from './shell/AssistantDock'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('pulseos.sidebar') === 'collapsed')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteMode, setPaletteMode] = useState('search')

  useEffect(() => {
    localStorage.setItem('pulseos.sidebar', collapsed ? 'collapsed' : 'expanded')
  }, [collapsed])

  useEffect(() => {
    const onKeyDown = (e) => {
      const isK = e.key?.toLowerCase() === 'k'
      const meta = e.metaKey || e.ctrlKey
      if (meta && isK) {
        e.preventDefault()
        setPaletteMode('search')
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  const contentPad = useMemo(
    () => (location.pathname === '/chat' ? 'p-0' : 'px-3 pb-10 pt-4 md:pt-6'),
    [location.pathname],
  )

  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed(v => !v)} onNavigate={() => {}} />
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex-1 min-w-0">
          <TopNav
            user={user}
            onOpenMobileSidebar={() => setMobileOpen(true)}
            onOpenCommandPalette={(mode) => {
              setPaletteMode(mode === 'create' ? 'create' : 'search')
              setPaletteOpen(true)
            }}
            onLogout={onLogout}
          />

          <main className={contentPad}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} mode={paletteMode} onClose={() => setPaletteOpen(false)} />
      <AssistantDock />
    </div>
  )
}
