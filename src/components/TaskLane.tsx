import type { Task } from '../types'
import { dangerButtonStyle, ghostButtonStyle } from './styles'
import { statusMeta } from './taskMeta'

interface TaskLaneProps {
  status: Task['status']
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const TaskLane = ({ status, tasks, onEdit, onDelete }: TaskLaneProps) => (
  <div className="grid gap-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${statusMeta[status].dot}`} />
        <h3 className="text-sm font-semibold">{statusMeta[status].label}</h3>
      </div>
      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {tasks.length}
      </span>
    </div>
    <ul className="grid gap-3">
      {tasks.length === 0 ? (
        <li className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Nothing here yet.
        </li>
      ) : null}
      {tasks.map((task) => (
        <li
          className="rounded-xl border border-slate-200/80 bg-white/80 p-4 shadow-sm transition hover:border-indigo-200/80 dark:border-slate-700/70 dark:bg-slate-900/40"
          key={task.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {task.title}
              </h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {task.description}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${statusMeta[task.status].badge}`}
            >
              {statusMeta[task.status].label}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <button className={ghostButtonStyle} onClick={() => onEdit(task)} type="button">
              Edit
            </button>
            <button
              className={`${dangerButtonStyle} p-2`}
              onClick={() => onDelete(task)}
              type="button"
              aria-label="Delete task"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 6V4h8v2m-9 3v10m4-10v10m4-10v10M6 6l1 14h10l1-14"
                />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
)

export default TaskLane
