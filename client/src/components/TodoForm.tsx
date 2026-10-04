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
    <form onSubmit={onAdd} className="flex border-b border-zinc-200">
      <input
        value={title}
        onChange={(e) => onTitle(e.target.value)}
        placeholder="Add a todo"
        maxLength={200}
        autoFocus
        className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-zinc-400"
      />
      <button className="px-1 text-sm font-medium hover:underline focus-visible:underline">
        Add
      </button>
    </form>
  )
}
