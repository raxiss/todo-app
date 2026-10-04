import type { Todo } from '../api.ts'
import TodoItem from './TodoItem.tsx'

export default function TodoList({
  todos,
  loading,
  onToggle,
  onRemove
}: {
  todos: Todo[]
  loading: boolean
  onToggle: (t: Todo) => void
  onRemove: (id: number) => void
}) {
  if (loading) return <p className="py-4 text-sm text-zinc-400">Loading…</p>
  if (todos.length === 0) return <p className="py-4 text-sm text-zinc-400">No todos.</p>
  return (
    <ul>
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} onToggle={() => onToggle(t)} onRemove={() => onRemove(t.id)} />
      ))}
    </ul>
  )
}
