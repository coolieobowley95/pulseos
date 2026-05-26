import { Router } from 'express'
import { getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goals.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()
router.use(protect)
router.get('/', getGoals)
router.post('/', createGoal)
router.put('/:id', updateGoal)
router.delete('/:id', deleteGoal)
export default router