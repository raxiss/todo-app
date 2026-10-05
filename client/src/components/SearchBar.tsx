export default function SearchBar({
  value,
  onChange
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search tasks"
      maxLength={200}
      className="w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3.5 py-2.5 text-sm outline-none transition placeholder:text-[#a79b84] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10"
    />
  )
}