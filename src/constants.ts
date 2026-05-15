export const APP_NAME = 'Task Manager'

const baseUrl = import.meta.env.BASE_URL
const normalizedBaseUrl = `${baseUrl.replace(/\/?$/, '')}/`

export const API_ROUTES = {
  login: `${normalizedBaseUrl}login`,
  tasks: `${normalizedBaseUrl}tasks`,
} as const

export const STORAGE_KEYS = {
  token: 'task-manager-token',
  tasks: 'task-manager-tasks',
} as const

export const AUTH = {
  username: 'test',
  password: 'test123',
  fakeToken: 'fake-jwt-token',
} as const

export const TASK_STATUS = {
  todo: 'todo',
  inProgress: 'in_progress',
  done: 'done',
} as const

export const TASK_STATUS_OPTIONS = [
  { value: TASK_STATUS.todo, label: 'To Do' },
  { value: TASK_STATUS.inProgress, label: 'In Progress' },
  { value: TASK_STATUS.done, label: 'Done' },
] as const
