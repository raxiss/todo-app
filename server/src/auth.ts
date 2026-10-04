import { Router } from 'express'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from './db/index.js'
import { users } from './db/schema.js'

const router = Router()

const authSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(4).max(100)
})

router.post('/signup', async (req, res) => {
  const parsed = authSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ status: 'error', message: 'Valid email + 4+ char password required' })
  }
  const { email, password } = parsed.data
  try {
    const existing = await db.select().from(users).where(eq(users.email, email))
    if (existing.length > 0) {
      return res.status(409).json({ status: 'error', message: 'Account exists — log in instead' })
    }
    const password_hash = await bcrypt.hash(password, 10)
    const rows = await db.insert(users).values({ email, password_hash }).returning({
      id: users.id,
      email: users.email
    })
    res.status(201).json({ status: 'ok', user: rows[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Internal Server Error' })
  }
})

router.post('/login', async (req, res) => {
  const parsed = authSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ status: 'error', message: 'Valid email + 4+ char password required' })
  }
  const { email, password } = parsed.data
  try {
    const rows = await db.select().from(users).where(eq(users.email, email))
    if (rows.length === 0) {
      return res.status(401).json({ status: 'error', message: 'Wrong email or password' })
    }
    const ok = await bcrypt.compare(password, rows[0].password_hash)
    if (!ok) {
      return res.status(401).json({ status: 'error', message: 'Wrong email or password' })
    }
    res.json({ status: 'ok', user: { id: rows[0].id, email: rows[0].email } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Internal Server Error' })
  }
})

export default router
