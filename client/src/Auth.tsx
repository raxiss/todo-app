import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import { login, signup } from './api.ts'

const formSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(4, 'Password must be 4+ characters').max(100)
})

export default function Auth({ onDone }: { onDone: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const parsed = formSchema.safeParse({ email, password: pass })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }
    setError(null)
    setBusy(true)
    try {
      const data = mode === 'login'
        ? await login(parsed.data.email, parsed.data.password)
        : await signup(parsed.data.email, parsed.data.password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('session', data.user.email)
      onDone(data.user.email)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Auth failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="dotgrid flex min-h-screen items-center justify-center bg-[#f4eee1] px-4 py-10">
      <main className="animate-rise paper-shadow w-full max-w-[380px] rounded-[24px] border border-[#e2d7bd] bg-[#fffdf6] p-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a79b84]">
          vol. 01 — a quiet page
        </p>
        <h1 className="mt-2 text-center text-[38px] leading-none tracking-tight">
          daybook<span className="text-[#bc4a1f]">.</span>
        </h1>
        <p className="mt-2 text-center text-[15.5px] italic text-[#7a6f5d]">
          {mode === 'login' ? 'welcome back — pick up where you left off' : 'a fresh page with your name on it'}
        </p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#211b12]">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="rounded-xl border border-[#e2d7bd] bg-[#f4eee1]/50 px-3.5 py-2.5 text-sm font-normal outline-none transition placeholder:text-[#b3a687] focus:border-[#211b12]/50 focus:bg-white"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#211b12]">
            Password
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="rounded-xl border border-[#e2d7bd] bg-[#f4eee1]/50 px-3.5 py-2.5 text-sm font-normal outline-none transition placeholder:text-[#b3a687] focus:border-[#211b12]/50 focus:bg-white"
            />
          </label>
          {error && (
            <p className="animate-fade rounded-xl border border-[#e0a583] bg-[#fbeede] px-3.5 py-2.5 text-[13px] text-[#9a3a14]">
              {error}
            </p>
          )}
          <button
            disabled={busy}
            className="mt-1 rounded-full bg-[#211b12] py-3 text-sm font-semibold text-[#f4eee1] transition hover:bg-[#bc4a1f] active:scale-[0.98] disabled:opacity-50"
          >
            {busy ? 'opening…' : mode === 'login' ? 'open my daybook' : 'start my daybook'}
          </button>
        </form>
        <p className="mt-5 text-center text-[13px] text-[#7a6f5d]">
          {mode === 'login' ? 'new around here? ' : 'already keeping one? '}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError(null)
            }}
            className="italic text-[#211b12] underline decoration-[#bc4a1f]/50 decoration-2 underline-offset-4 transition hover:text-[#bc4a1f]"
          >
            {mode === 'login' ? 'start one' : 'open it'}
          </button>
        </p>
      </main>
    </div>
  )
}
