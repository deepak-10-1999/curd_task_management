import type { ReactNode } from 'react'
import { cardStyle, ghostButtonStyle } from './styles'

interface TaskModalProps {
  title: string
  description: string
  onClose: () => void
  children: ReactNode
}

const TaskModal = ({ title, description, onClose, children }: TaskModalProps) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 px-4 py-8">
    <section
      className={`${cardStyle} w-full max-w-2xl`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        <button
          className={`${ghostButtonStyle} px-3 py-2`}
          onClick={onClose}
          type="button"
          aria-label="Close modal"
        >
          Close
        </button>
      </div>
      {children}
    </section>
  </div>
)

export default TaskModal
