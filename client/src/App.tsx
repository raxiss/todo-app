import { useEffect, useState } from 'react'
import { createTodo, deleteTodo, fetchTodos, toggleTodo, type Todo } from './api.ts'
import Auth from './Auth.tsx'
import Sidebar, { type Filter } from './components/Sidebar.tsx'
import SearchBar from './components/SearchBar.tsx'
import TodoForm from './components/TodoForm.tsx'
import TodoList from './components/TodoList.tsx'

export default function App() {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('session'))
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetchTodos()
      .then((rows) => setTodos(rows.sort((a, b) => b.id - a.id)))
      .catch(showError)
      .finally(() => setLoading(false))
  }, [user])

  function showError(e: unknown) {
    setError(e instanceof Error ? e.message : 'Something went wrong')
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    const text = title.trim()
    if (!text) return
    setError(null)
    try {
      const todo = await createTodo(text, text)
      setTodos([todo, ...todos])
      setTitle('')
    } catch (e) {
      showError(e)
    }
  }

  async function toggle(todo: Todo) {
    try {
      const updated = await toggleTodo(todo)
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)))
    } catch (e) {
      showError(e)
    }
  }

  async function remove(id: number) {
    try {
      await deleteTodo(id)
      setTodos(todos.filter((t) => t.id !== id))
    } catch (e) {
      showError(e)
    }
  }

  async function clearCompleted() {
    const done = todos.filter((t) => t.completed)
    try {
      await Promise.all(done.map((t) => deleteTodo(t.id)))
      setTodos(todos.filter((t) => !t.completed))
    } catch (e) {
      showError(e)
    }
  }

  function logout() {
    localStorage.removeItem('session')
    setUser(null)
    setTodos([])
    setQuery('')
    setFilter('all')
  }

  if (!user) return <Auth onDone={setUser} />

  const doneCount = todos.filter((t) => t.completed).length
  const counts = { all: todos.length, active: todos.length - doneCount, completed: doneCount }

  const q = query.trim().toLowerCase()
  const visible = todos.filter((t) => {
    if (filter === 'active' && t.completed) return false
    if (filter === 'completed' && !t.completed) return false
    return t.title.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q)
  })

  const heading = { all: 'All tasks', active: 'Active', completed: 'Completed' }[filter]

  return (
    <div className="dotgrid flex min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <Sidebar
        user={user}
        counts={counts}
        filter={filter}
        onFilter={setFilter}
        onClearCompleted={clearCompleted}
        onLogout={logout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-lg border border-[var(--line)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--ink)] lg:hidden"
          >
            Menu
          </button>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">{heading}</h1>
        </div>

        <TodoForm title={title} onTitle={setTitle} onAdd={addTodo} />

        {error && (
          <p className="mt-3 rounded-xl border border-[#e0a583] bg-[#fbeede] px-3.5 py-2.5 text-sm text-[var(--accent-deep)]">{error}</p>
        )}

        <div className="mt-5">
          <SearchBar value={query} onChange={setQuery} />
        </div>

        <div className="mt-4">
          <TodoList
            todos={visible}
            loading={loading}
            filtered={q !== '' || filter !== 'all'}
            onToggle={toggle}
            onRemove={remove}
          />
        </div>
      </main>
    </div>
  )
}