import { useState } from 'react'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(4, 'Password must be 4+ characters').max(100)
})

async function req<T>(path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  } catch {
    throw new Error('Cannot reach server — run `npm run dev`')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.status !== 'ok') {
    throw new Error(data.message || `Request failed: ${res.status}`)
  }
  return data
}

export default function Auth({ onDone }: { onDone: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = formSchema.safeParse({ email, password: pass })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    setError(null)
    setBusy(true)
    try {
      const data = await req<{ user: { email: string } }>(
        `/api/auth/${mode}`,
        parsed.data
      )
      localStorage.setItem('session', data.user.email)
      onDone(data.user.email)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Auth failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200 px-4">
      <main className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-lg font-bold text-white">
            ✓
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {mode === 'login' ? 'Log in to manage your todos' : 'Create an account to get started'}
          </p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-normal outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Password
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-normal outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </label>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <button
            disabled={busy}
            className="mt-1 rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50"
          >
            {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-500">
          {mode === 'login' ? 'No account? ' : 'Have an account? '}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError(null)
            }}
            className="font-medium text-zinc-900 underline underline-offset-2"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </main>
    </div>
  )
}
