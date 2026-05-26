import { prisma } from '../lib/prisma.js'

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    })
    res.json(tasks)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createTask = async (req, res) => {
  try {
    const { title, dueDate, priority } = req.body
    if (!title) return res.status(400).json({ message: 'Title required' })
    const task = await prisma.task.create({
      data: { title, dueDate: dueDate ? new Date(dueDate) : null, priority, userId: req.userId }
    })
    res.status(201).json(task)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const updateTask = async (req, res) => {
  try {
    const { title, done, dueDate, priority } = req.body
    const task = await prisma.task.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: { title, done, dueDate: dueDate ? new Date(dueDate) : undefined, priority }
    })
    res.json(updated)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const deleteTask = async (req, res) => {
  try {
    const task = await prisma.task.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    await prisma.task.delete({ where: { id: req.params.id } })
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}