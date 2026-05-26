import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './src/routes/auth.routes.js'
import taskRoutes from './src/routes/tasks.routes.js'
import goalRoutes from './src/routes/goals.routes.js'
import journalRoutes from './src/routes/journal.routes.js'
import chatRoutes from './src/routes/chat.routes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ message: 'PulseOS API is running 🚀' }))
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/journal', journalRoutes)
app.use('/api/chat', chatRoutes)

app.listen(PORT, () => {
  console.log(`PulseOS server running on port ${PORT}`)
  console.log('GROQ Key:', process.env.GROQ_API_KEY ? 'YES ✓' : 'NO ✗')
})