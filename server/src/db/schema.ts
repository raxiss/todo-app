import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core'


export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  completed: boolean('completed').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
})
