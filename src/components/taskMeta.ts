import { TASK_STATUS } from '../constants'
import type { Task } from '../types'

export const statusMeta: Record<
  Task['status'],
  { label: string; helper: string; badge: string; dot: string }
> = {
  [TASK_STATUS.todo]: {
    label: 'To Do',
    helper: 'Up next',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200',
    dot: 'bg-sky-400',
  },
  [TASK_STATUS.inProgress]: {
    label: 'In Progress',
    helper: 'In motion',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
    dot: 'bg-amber-400',
  },
  [TASK_STATUS.done]: {
    label: 'Done',
    helper: 'Completed',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
    dot: 'bg-emerald-400',
  },
}

export const statusOrder: Task['status'][] = [
  TASK_STATUS.todo,
  TASK_STATUS.inProgress,
  TASK_STATUS.done,
]
