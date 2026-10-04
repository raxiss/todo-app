export default function TodoHeader({
  user,
  total,
  done,
  onLogout
}: {
  user: string
  total: number
  done: number
  onLogout: () => void
}) {
  return (
    <header className="flex items-baseline justify-between border-b border-zinc-900 pb-3">
      <h1 className="text-lg font-semibold">
        Todos
        {total > 0 && (
          <span className="ml-2 font-normal text-zinc-500">
            {done}/{total}
          </span>
        )}
      </h1>
      <div className="flex items-baseline gap-3 text-sm text-zinc-500">
        <span>{user}</span>
        <button onClick={onLogout} className="underline hover:text-zinc-900">
          Log out
        </button>
      </div>
    </header>
  )
}
