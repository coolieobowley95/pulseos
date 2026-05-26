import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Goals from './pages/Goals'
import Journal from './pages/Journal'
import AIChat from './pages/AIChat'
import Layout from './components/Layout'

const Private = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-3xl glass-strong px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neon-blue/90 to-neon-purple/90 flex items-center justify-center font-bold">
            P
          </div>
          <div>
            <div className="text-sm font-semibold text-fg">Booting PulseOS</div>
            <div className="text-xs text-fg-muted">Syncing your system…</div>
          </div>
          <div className="ml-3 w-5 h-5 rounded-full border-2 border-white/20 border-t-transparent animate-spin" />
        </div>
      </div>
    )
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Private><Layout /></Private>}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="goals" element={<Goals />} />
        <Route path="journal" element={<Journal />} />
        <Route path="chat" element={<AIChat />} />
      </Route>
    </Routes>
  )
}
