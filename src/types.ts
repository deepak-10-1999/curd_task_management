import { TASK_STATUS } from './constants'

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
}

export interface Credentials {
  username: string
  password: string
}

export interface TaskInput {
  title: string
  description: string
  status: TaskStatus
}
