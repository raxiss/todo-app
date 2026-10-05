import type { Todo } from '../api.ts'
import TodoItem from './TodoItem.tsx'

export default function TodoList({
  todos,
  loading,
  filtered,
  onToggle,
  onRemove
}: {
  todos: Todo[]
  loading: boolean
  filtered: boolean
  onToggle: (t: Todo) => void
  onRemove: (id: number) => void
}) {
  if (loading) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] px-4 py-8 text-center text-sm text-[var(--ink-soft)]">
        Loading…
      </p>
    )
  }

  if (todos.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--card)] px-4 py-8 text-center text-sm text-[var(--ink-soft)]">
        {filtered ? 'No tasks match.' : 'No tasks yet. Add one above.'}
      </p>
    )
  }

  return (
    <ul className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)] divide-y divide-[var(--line)] paper-shadow">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} onToggle={() => onToggle(t)} onRemove={() => onRemove(t.id)} />
      ))}
    </ul>
  )
}