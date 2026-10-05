export type Filter = 'all' | 'active' | 'completed'

const links: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' }
]

type Props = {
  user: string
  counts: Record<Filter, number>
  filter: Filter
  onFilter: (f: Filter) => void
  onClearCompleted: () => void
  onLogout: () => void
  open: boolean
  onClose: () => void
}

export default function Sidebar({
  user,
  counts,
  filter,
  onFilter,
  onClearCompleted,
  onLogout,
  open,
  onClose
}: Props) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-[var(--ink)]/30 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-[var(--line)] bg-[var(--paper-soft)] p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <h2 className="px-2 text-2xl font-semibold tracking-tight">
          daybook<span className="text-[var(--accent)]">.</span>
        </h2>

        <nav className="mt-4 flex flex-col gap-1">
          {links.map((link) => (
            <button
              key={link.key}
              onClick={() => {
                onFilter(link.key)
                onClose()
              }}
              className={`flex justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                filter === link.key
                  ? 'bg-[var(--card)] font-medium text-[var(--accent-deep)] shadow-sm'
                  : 'text-[var(--ink-soft)] hover:bg-[var(--card)]/70 hover:text-[var(--ink)]'
              }`}
            >
              <span>{link.label}</span>
              <span className="tabular-nums text-[var(--ink-soft)]">{counts[link.key]}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2 text-sm">
          {counts.completed > 0 && (
            <button
              onClick={onClearCompleted}
              className="w-full rounded-lg px-3 py-2 text-left text-[var(--ink-soft)] transition-colors hover:bg-[var(--card)]/70 hover:text-[var(--accent-deep)]"
            >
              Clear completed
            </button>
          )}
          <p className="truncate px-2 text-[var(--ink-soft)]">{user}</p>
          <button
            onClick={onLogout}
            className="w-full rounded-lg border cursor-pointer border-[var(--line)] bg-[var(--card)] py-2 text-sm text-[var(--ink-soft)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-deep)]"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}