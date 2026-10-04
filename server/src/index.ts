import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import todosRouter from './todos.js'
import authRouter from './auth.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json()) 

app.use('/api/todos', todosRouter)
app.use('/api/auth', authRouter)


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
