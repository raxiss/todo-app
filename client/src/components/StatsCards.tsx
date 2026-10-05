export default function StatsCards({
  total,
  active,
  done,
  pct
}: {
  total: number
  active: number
  done: number
  pct: number
}) {
  return (
    <section className="paper-shadow rounded-[20px] border border-[#e2d7bd] bg-[#fffdf6] px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a79b84]">
            Open
          </p>
          <p className="text-[34px] font-semibold leading-none text-[#211b12]">
            {active}
            <span className="ml-2 align-middle font-sans text-[12px] font-normal not-italic text-[#7a6f5d]">
              {active === 1 ? 'thread hanging' : 'threads hanging'}
            </span>
          </p>
        </div>
        <div className="hidden h-10 w-px bg-[#e2d7bd] sm:block" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a79b84]">
            Filed
          </p>
          <p className="text-[34px] font-semibold leading-none text-[#211b12]">
            {done}
            <span className="ml-2 align-middle font-sans text-[12px] font-normal not-italic text-[#7a6f5d]">
              put to rest
            </span>
          </p>
        </div>
        <div className="ml-auto min-w-[140px] flex-1 sm:max-w-[220px]">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a79b84]">
              {total === 0 ? 'a fresh page' : pct === 100 ? 'page complete' : `${pct}% through`}
            </p>
            <p className="text-[15px] italic text-[#7a6f5d]">
              {done}/{total}
            </p>
          </div>
          <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-[#ede5d3]">
            <div
              className="h-full rounded-full bg-[#bc4a1f] transition-[width] duration-700 ease-[cubic-bezier(0.22,0.68,0.32,1)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
