import { Router } from 'express'
import { getJournals, createJournal, deleteJournal } from '../controllers/journal.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()
router.use(protect)
router.get('/', getJournals)
router.post('/', createJournal)
router.delete('/:id', deleteJournal)
export default router