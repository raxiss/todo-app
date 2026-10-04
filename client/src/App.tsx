import { useEffect, useState } from 'react'
import { createTodo, deleteTodo, fetchTodos, toggleTodo, type Todo } from './api.ts'
import Auth from './Auth.tsx'

export default function App() {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('session'))
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetchTodos().then(setTodos).catch(show).finally(() => setLoading(false))
  }, [user])

  function show(e: unknown) {
    setError(e instanceof Error ? e.message : 'Something went wrong')
  }

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setError(null)
    try {
      const todo = await createTodo(title.trim(), title.trim())
      setTodos((p) => [todo, ...p])
      setTitle('')
    } catch (e) {
      show(e)
    }
  }

  async function toggle(t: Todo) {
    try {
      const u = await toggleTodo(t)
      setTodos((p) => p.map((x) => (x.id === t.id ? u : x)))
    } catch (e) {
      show(e)
    }
  }

  async function remove(id: number) {
    try {
      await deleteTodo(id)
      setTodos((p) => p.filter((x) => x.id !== id))
    } catch (e) {
      show(e)
    }
  }

  if (!user) return <Auth onDone={setUser} />

  function logout() {
    localStorage.removeItem('session')
    setUser(null)
    setTodos([])
  }

  const done = todos.filter((t) => t.completed).length

  return (
    <div className="min-h-screen bg-white px-4 py-12 text-zinc-900">
      <main className="mx-auto w-full max-w-lg">
        <header className="flex items-baseline justify-between border-b border-zinc-900 pb-3">
          <h1 className="text-lg font-semibold">
            Todos
            {todos.length > 0 && (
              <span className="ml-2 font-normal text-zinc-500">
                {done}/{todos.length}
              </span>
            )}
          </h1>
          <div className="flex items-baseline gap-3 text-sm text-zinc-500">
            <span>{user}</span>
            <button onClick={logout} className="underline hover:text-zinc-900">
              Log out
            </button>
          </div>
        </header>

        <form onSubmit={add} className="flex border-b border-zinc-200">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a todo"
            maxLength={200}
            autoFocus
            className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-zinc-400"
          />
          <button className="px-1 text-sm font-medium hover:underline focus-visible:underline">
            Add
          </button>
        </form>

        {error && <p className="border-b border-zinc-200 py-2 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="py-4 text-sm text-zinc-400">Loading…</p>
        ) : todos.length === 0 ? (
          <p className="py-4 text-sm text-zinc-400">No todos.</p>
        ) : (
          <ul>
            {todos.map((t) => (
              <li key={t.id} className="group flex items-center gap-3 border-b border-zinc-200 py-2.5">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggle(t)}
                  className="h-4 w-4 accent-zinc-900"
                />
                <span className={`flex-1 text-sm ${t.completed ? 'text-zinc-400 line-through' : ''}`}>
                  {t.title}
                </span>
                <button
                  onClick={() => remove(t.id)}
                  aria-label={`Delete ${t.title}`}
                  className="text-sm text-zinc-400 hover:text-red-600 focus-visible:text-red-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}