import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import todosRouter from './todos.js'
import authRouter from './auth.js'
import { checkDb } from './db/index.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    await checkDb()
    res.json({ status: 'ok', db: 'up' })
  } catch (error) {
    console.error('[health] db unreachable:', error)
    res.status(503).json({ status: 'error', db: 'down' })
  }
})

app.use('/api/todos', todosRouter)
app.use('/api/auth', authRouter)


app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`)
  try {
    await checkDb()
    console.log('[db] connected')
  } catch (error) {
    console.error('[db] unreachable at startup — requests will retry on demand:', (error as Error)?.message)
  }
})
