import { Router } from 'express'
import { desc, eq, ilike, or } from 'drizzle-orm'
import { z } from 'zod'
import { db, isTransientDbError, withDbRetry } from './db/index.js'
import { todos } from './db/schema.js'

const router = Router()

function dbError(res: import('express').Response, error: unknown) {
  console.error(error)
  if (isTransientDbError(error)) {
    return res.status(503).json({
      status: 'error',
      message: 'Database is waking up — please retry in a few seconds'
    })
  }
  return res.status(500).json({ status: 'error', message: 'Internal Server Error' })
}

const createTodoSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(500)
})

const updateTodoSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().min(1).max(500).optional(),
  completed: z.boolean().optional()
})

router.get('/', async (req, res) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 200) : ''
    const allTodos = await withDbRetry(() =>
      q
        ? db
            .select()
            .from(todos)
            .where(or(ilike(todos.title, `%${q}%`), ilike(todos.description, `%${q}%`)))
            .orderBy(desc(todos.id))
        : db.select().from(todos).orderBy(desc(todos.id))
    )
    res.json({ status: 'ok', todos: allTodos })
  } catch (error) {
    return dbError(res, error)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid id' })
    }
    const rows = await withDbRetry(() => db.select().from(todos).where(eq(todos.id, id)))
    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Todo not found' })
    }
    res.json({ status: 'ok', todo: rows[0] })
  } catch (error) {
    return dbError(res, error)
  }
})

router.post('/', async (req, res) => {
  try {
    const parsed = createTodoSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ status: 'error', message: 'Title and description are required' })
    }
    const { title, description } = parsed.data
    const rows = await withDbRetry(() =>
      db
        .insert(todos)
        .values({
          title,
          description
        })
        .returning()
    )
    res.status(201).json({
      status: 'ok',
      todo: rows[0]
    })
  } catch (error) {
    return dbError(res, error)
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
    const existing = await withDbRetry(() => db.select().from(todos).where(eq(todos.id, id)))
    if (existing.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Todo not found' })
    }
    const rows = await withDbRetry(() =>
      db
        .update(todos)
        .set({
          ...(title !== undefined ? { title } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(completed !== undefined ? { completed } : {})
        })
        .where(eq(todos.id, id))
        .returning()
    )
    res.json({
      status: 'ok',
      todo: rows[0]
    })
  } catch (error) {
    return dbError(res, error)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid id' })
    }
    const rows = await withDbRetry(() => db.delete(todos).where(eq(todos.id, id)).returning())
    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Todo not found' })
    }
    res.json({
      status: 'ok',
      id
    })
  } catch (error) {
    return dbError(res, error)
  }
})

export default router
