import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from './db/index.js'
import { todos } from './db/schema.js'

const router = Router()

const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(500)
})

const updateTodoSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(500).optional(),
  completed: z.boolean().optional()
})

router.get('/', async (_req, res) => {
  try {
    const allTodos = await db.select().from(todos)
    res.json({ status: 'ok', todos: allTodos })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Internal Server Error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid id' })
    }
    const rows = await db.select().from(todos).where(eq(todos.id, id))
    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Todo not found' })
    }
    res.json({ status: 'ok', todo: rows[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Internal Server Error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const parsed = createTodoSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', message: 'Title and description are required' })
    }
    const { title, description } = parsed.data
    const rows = await db
      .insert(todos)
      .values({
        title,
        description
      })
      .returning()
    res.status(201).json({
      status: 'ok',
      todo: rows[0]
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Internal Server Error' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid id' })
    }
    const parsed = updateTodoSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', message: 'Invalid update data' })
    }
    const { title, description, completed } = parsed.data
    const existing = await db.select().from(todos).where(eq(todos.id, id))
    if (existing.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Todo not found' })
    }
    const rows = await db
      .update(todos)
      .set({
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(completed !== undefined ? { completed } : {})
      })
      .where(eq(todos.id, id))
      .returning()
    res.json({
      status: 'ok',
      todo: rows[0]
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Internal Server Error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid id' })
    }
    const rows = await db.delete(todos).where(eq(todos.id, id)).returning()
    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Todo not found' })
    }
    res.json({
      status: 'ok',
      id
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Internal Server Error' })
  }
})

export default router
