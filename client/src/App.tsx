import { useEffect, useState } from 'react'
import { createTodo, deleteTodo, fetchTodos, toggleTodo, type Todo } from './api.ts'
import Auth from './Auth.tsx'
import TodoHeader from './components/TodoHeader.tsx'
import TodoForm from './components/TodoForm.tsx'
import TodoList from './components/TodoList.tsx'

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
        <TodoHeader user={user} total={todos.length} done={done} onLogout={logout} />
        <TodoForm title={title} onTitle={setTitle} onAdd={add} />
        {error && <p className="border-b border-zinc-200 py-2 text-sm text-red-600">{error}</p>}
        <TodoList todos={todos} loading={loading} onToggle={toggle} onRemove={remove} />
      </main>
    </div>
  )
}
