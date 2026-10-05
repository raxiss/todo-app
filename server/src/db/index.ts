import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema.js'

const url = process.env.DATABASE_URL
if (!url) {
  throw new Error(
    'DATABASE_URL is missing — copy server/.env.example or set it in your environment'
  )
}

const sql = neon(url)
export const db = drizzle(sql, { schema })

const TRANSIENT = /fetch failed|connect timeout|timeout|econnreset|enotfound|eai_again|ssl|packet length|wake|paused|503|502/i

/** Network-level Neon failures (cold start, wake-from-pause, TLS blip) have no SQL code. */
export function isTransientDbError(e: unknown): boolean {
  if (!e || typeof e !== 'object') return false
  const err = e as Record<string, unknown>
  // NeonDbError without a Postgres code/severity = transport failure, not a query failure
  if ('code' in err && typeof err.code === 'string' && err.code) return false
  if ('severity' in err && typeof err.severity === 'string' && err.severity) return false
  const hay = [err.message, (err.sourceError as { message?: unknown } | undefined)?.message, err.cause]
    .map(String)
    .join(' | ')
  return TRANSIENT.test(hay)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Neon free-tier projects pause after inactivity; the first query wakes the
 * project but the default ~10s HTTP timeout can fire first. Retry transient
 * transport errors with backoff so a cold start looks like a slow request,
 * not a 500.
 */
export async function withDbRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let last: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      last = e
      if (!isTransientDbError(e) || i === attempts - 1) throw e
      const wait = 800 * 2 ** i
      console.warn(`[db] transient error (attempt ${i + 1}/${attempts}), retrying in ${wait}ms`)
      await sleep(wait)
    }
  }
  throw last
}

export async function checkDb(): Promise<void> {
  await withDbRetry(() => sql('select 1'), 2)
}
