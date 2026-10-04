import type { Todo } from '../api.ts'

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
    <li className="group flex items-center gap-3 border-b border-zinc-200 py-2.5">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        className="h-4 w-4 accent-zinc-900"
      />
      <span className={`flex-1 text-sm ${todo.completed ? 'text-zinc-400 line-through' : ''}`}>
        {todo.title}
      </span>
      <button
        onClick={onRemove}
        aria-label={`Delete ${todo.title}`}
        className="text-sm text-zinc-400 hover:text-red-600 focus-visible:text-red-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
      >
        Delete
      </button>
    </li>
  )
}
