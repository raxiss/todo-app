import type { Todo } from '../api.ts'

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function TodoItem({
  todo,
  onToggle,
  onRemove
}: {
  todo: Todo
  onToggle: () => void
  onRemove: () => void
}) {
  return (
    <li className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="mt-1 h-4 w-4 cursor-pointer accent-[var(--accent)]"
      />
      <div className="min-w-0 flex-1">
        <p className={todo.completed ? 'text-[var(--ink-soft)] line-through decoration-[var(--accent)]/50' : ''}>{todo.title}</p>
        {todo.created_at && (
          <p className="mt-0.5 text-xs text-[var(--ink-soft)]">{formatDate(todo.created_at)}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="rounded px-1.5 py-0.5 text-sm cursor-pointer text-[var(--ink-soft)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--accent-deep)]"
        aria-label={`Delete ${todo.title}`}
      >
        Delete
      </button>
    </li>
  )
}