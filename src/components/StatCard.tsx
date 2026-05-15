interface StatCardProps {
  label: string
  value: string | number
  helper: string
  tone: string
}

const StatCard = ({ label, value, helper, tone }: StatCardProps) => (
  <div
    className={`relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-sm ${tone} dark:border-slate-700/60 dark:bg-slate-900/50`}
  >
    <div className="relative z-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{helper}</p>
    </div>
    <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/40" />
  </div>
)

export default StatCard
