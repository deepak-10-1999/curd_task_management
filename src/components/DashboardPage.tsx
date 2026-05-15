import { useEffect, useMemo, useState } from 'react'
import { clearTasks, createTask, deleteTask, fetchTasks, logout, updateTask } from '../app/store'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { TASK_STATUS } from '../constants'
import type { Task, TaskInput } from '../types'
import StatCard from './StatCard'
import TaskForm from './TaskForm'
import TaskLane from './TaskLane'
import TaskModal from './TaskModal'
import { cardStyle, primaryButtonStyle, secondaryButtonStyle } from './styles'
import { statusMeta, statusOrder } from './taskMeta'

type ModalState = { type: 'create' } | { type: 'edit'; task: Task } | null

const DashboardPage = () => {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((state) => state.tasks)
  const [modalState, setModalState] = useState<ModalState>(null)

  useEffect(() => {
    void dispatch(fetchTasks())
  }, [dispatch])

  const sortedTasks = useMemo(
    () => [...items].sort((a, b) => a.title.localeCompare(b.title)),
    [items],
  )

  const tasksByStatus = useMemo(() => {
    const grouped: Record<Task['status'], Task[]> = {
      [TASK_STATUS.todo]: [],
      [TASK_STATUS.inProgress]: [],
      [TASK_STATUS.done]: [],
    }

    sortedTasks.forEach((task) => {
      grouped[task.status].push(task)
    })

    return grouped
  }, [sortedTasks])

  const stats = useMemo(() => {
    const total = items.length
    const todo = tasksByStatus[TASK_STATUS.todo].length
    const inProgress = tasksByStatus[TASK_STATUS.inProgress].length
    const done = tasksByStatus[TASK_STATUS.done].length
    const completionRate = total ? Math.round((done / total) * 100) : 0

    return { total, todo, inProgress, done, completionRate }
  }, [items.length, tasksByStatus])

  const onLogout = async () => {
    dispatch(logout())
    dispatch(clearTasks())
  }

  const closeModal = () => setModalState(null)

  const handleSubmit = async (input: TaskInput) => {
    if (!modalState) {
      return
    }

    if (modalState.type === 'edit') {
      await dispatch(updateTask({ id: modalState.task.id, input })).unwrap()
    } else {
      await dispatch(createTask(input)).unwrap()
    }

    closeModal()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-6 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-slate-50">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className={`${cardStyle} relative overflow-hidden`}>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-sky-500/5 to-transparent"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
                  Workspace
                </p>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Manage your daily work in one place.
                </p>
              </div>
              <button
                className={secondaryButtonStyle}
                onClick={() => {
                  void onLogout()
                }}
                type="button"
              >
                Logout
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total tasks"
                value={stats.total}
                helper="All tracked items"
                tone="bg-gradient-to-br from-indigo-500/10 via-white/40 to-transparent"
              />
              <StatCard
                label="To do"
                value={stats.todo}
                helper={statusMeta[TASK_STATUS.todo].helper}
                tone="bg-gradient-to-br from-sky-500/10 via-white/40 to-transparent"
              />
              <StatCard
                label="In progress"
                value={stats.inProgress}
                helper={statusMeta[TASK_STATUS.inProgress].helper}
                tone="bg-gradient-to-br from-amber-500/10 via-white/40 to-transparent"
              />
              <StatCard
                label="Completion"
                value={`${stats.completionRate}%`}
                helper="Done this cycle"
                tone="bg-gradient-to-br from-emerald-500/10 via-white/40 to-transparent"
              />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className={`${cardStyle} grid gap-4`}>
            <div>
              <h2 className="text-lg font-semibold">Create task</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Open the quick modal form to add new work.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className={primaryButtonStyle}
                onClick={() => setModalState({ type: 'create' })}
                type="button"
              >
                New task
              </button>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Keep tasks detailed and status-ready.
              </p>
            </div>
          </section>

          <section className={`${cardStyle} grid gap-4`}>
            <div>
              <h2 className="text-lg font-semibold">Focus today</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Keep your priorities tight and visible.
              </p>
            </div>
            <div className="grid gap-3">
              {statusOrder.map((status) => (
                <div
                  key={status}
                  className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm dark:border-slate-700/70 dark:bg-slate-900/40"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${statusMeta[status].dot}`} />
                    <span className="font-semibold">{statusMeta[status].label}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                    {tasksByStatus[status].length} tasks
                  </span>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className={`${cardStyle} grid gap-4`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Tasks</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Review work by status and keep flow moving.
              </p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {items.length} total
            </span>
          </div>

          {loading ? <p className="text-sm">Loading tasks...</p> : null}

          {!loading && error ? (
            <p role="alert" className="text-sm text-rose-600">
              {error}
            </p>
          ) : null}

          {!loading && !error && sortedTasks.length === 0 ? (
            <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-100">
              No tasks yet. Use the New task button to get started.
            </p>
          ) : null}

          {!loading && !error && sortedTasks.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {statusOrder.map((status) => (
                <TaskLane
                  key={status}
                  status={status}
                  tasks={tasksByStatus[status]}
                  onEdit={(task) => setModalState({ type: 'edit', task })}
                  onDelete={(task) => {
                    void dispatch(deleteTask(task.id))
                  }}
                />
              ))}
            </div>
          ) : null}
        </section>
      </section>

      {modalState ? (
        <TaskModal
          title={modalState.type === 'edit' ? 'Edit task' : 'Add task'}
          description={
            modalState.type === 'edit'
              ? 'Update details without losing context.'
              : 'Capture the details and set a status.'
          }
          onClose={closeModal}
        >
          <TaskForm
            formId={modalState.type === 'edit' ? 'edit-task' : 'add-task'}
            initialTask={modalState.type === 'edit' ? modalState.task : undefined}
            onCancel={closeModal}
            onSubmit={handleSubmit}
            submitLabel={modalState.type === 'edit' ? 'Save changes' : 'Add task'}
          />
        </TaskModal>
      ) : null}
    </main>
  )
}

export default DashboardPage
