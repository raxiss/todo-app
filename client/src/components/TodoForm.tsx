export default function TodoForm({
  title,
  onTitle,
  onAdd
}: {
  title: string
  onTitle: (v: string) => void
  onAdd: (e: React.FormEvent) => void
}) {
  return (
    <form onSubmit={onAdd} className="flex gap-2">
      <input
        value={title}
        onChange={(e) => onTitle(e.target.value)}
        placeholder="Add a task"
        maxLength={200}
        autoFocus
        className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--card)] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-[#a79b84] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="rounded-xl bg-[var(--accent)] cursor-pointer px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-deep)] disabled:cursor-not-allowed disabled:bg-[var(--paper-soft)] disabled:text-[var(--ink-soft)]"
      >
        Add
      </button>
    </form>
  )
}