import { prisma } from '../lib/prisma.js'

export const getGoals = async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } })
    res.json(goals)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createGoal = async (req, res) => {
  try {
    const { title, target } = req.body
    if (!title) return res.status(400).json({ message: 'Title required' })
    const goal = await prisma.goal.create({ data: { title, target: target || 100, userId: req.userId } })
    res.status(201).json(goal)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const updateGoal = async (req, res) => {
  try {
    const { title, progress, target } = req.body
    const goal = await prisma.goal.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!goal) return res.status(404).json({ message: 'Goal not found' })
    const updated = await prisma.goal.update({ where: { id: req.params.id }, data: { title, progress, target } })
    res.json(updated)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const deleteGoal = async (req, res) => {
  try {
    const goal = await prisma.goal.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!goal) return res.status(404).json({ message: 'Goal not found' })
    await prisma.goal.delete({ where: { id: req.params.id } })
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}