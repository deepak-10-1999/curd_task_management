import { useState, type FormEvent } from 'react'
import { TASK_STATUS, TASK_STATUS_OPTIONS } from '../constants'
import type { Task, TaskInput } from '../types'
import { fieldStyle, primaryButtonStyle, secondaryButtonStyle } from './styles'

interface TaskFormProps {
  onSubmit: (input: TaskInput) => Promise<void>
  submitLabel: string
  formId: string
  initialTask?: Task
  onCancel?: () => void
}

const TaskForm = ({
  onSubmit,
  submitLabel,
  formId,
  initialTask,
  onCancel,
}: TaskFormProps) => {
  const [title, setTitle] = useState(initialTask?.title ?? '')
  const [description, setDescription] = useState(initialTask?.description ?? '')
  const [status, setStatus] = useState<TaskInput['status']>(
    initialTask?.status ?? TASK_STATUS.todo,
  )
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required')
      return
    }

    setError(null)
    await onSubmit({ title: title.trim(), description: description.trim(), status })

    if (!initialTask) {
      setTitle('')
      setDescription('')
      setStatus(TASK_STATUS.todo)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium" htmlFor={`${formId}-title`}>
            Title
          </label>
          <input
            id={`${formId}-title`}
            className={fieldStyle}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor={`${formId}-status`}>
            Status
          </label>
          <select
            id={`${formId}-status`}
            className={fieldStyle}
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskInput['status'])}
          >
            {TASK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor={`${formId}-description`}>
          Description
        </label>
        <textarea
          id={`${formId}-description`}
          className={fieldStyle}
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button className={primaryButtonStyle} type="submit">
          {submitLabel}
        </button>
        {onCancel ? (
          <button className={secondaryButtonStyle} onClick={onCancel} type="button">
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default TaskForm
