import { prisma } from '../lib/prisma.js'
import { CohereClient } from 'cohere-ai'

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY })

export const getJournals = async (req, res) => {
  try {
    const journals = await prisma.journal.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } })
    res.json(journals)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createJournal = async (req, res) => {
  try {
    const { content, mood } = req.body
    if (!content) return res.status(400).json({ message: 'Content required' })

    let summary = null
    try {
      const response = await cohere.chat({
        model: 'command-a-03-2025',
        message: `Summarise this journal entry in 2-3 sentences:\n\n${content}`
      })
      summary = response.text
    } catch { }

    const journal = await prisma.journal.create({ data: { content, mood, summary, userId: req.userId } })
    res.status(201).json(journal)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const deleteJournal = async (req, res) => {
  try {
    const journal = await prisma.journal.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!journal) return res.status(404).json({ message: 'Journal not found' })
    await prisma.journal.delete({ where: { id: req.params.id } })
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}