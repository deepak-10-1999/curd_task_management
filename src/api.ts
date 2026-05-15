import { API_ROUTES } from './constants'
import type { Credentials, Task, TaskInput } from './types'

const toError = async (response: Response): Promise<never> => {
  const data = (await response.json().catch(() => ({ message: 'Request failed' }))) as {
    message?: string
  }
  throw new Error(data.message ?? 'Request failed')
}

const request = async <T>(
  url: string,
  init: RequestInit,
  token?: string,
): Promise<T> => {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, { ...init, headers })

  if (!response.ok) {
    return toError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const loginRequest = (credentials: Credentials): Promise<{ token: string }> =>
  request<{ token: string }>(API_ROUTES.login, {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

export const getTasksRequest = (token: string): Promise<Task[]> =>
  request<Task[]>(API_ROUTES.tasks, { method: 'GET' }, token)

export const createTaskRequest = (token: string, input: TaskInput): Promise<Task> =>
  request<Task>(
    API_ROUTES.tasks,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    token,
  )

export const updateTaskRequest = (
  token: string,
  id: string,
  input: TaskInput,
): Promise<Task> =>
  request<Task>(
    `${API_ROUTES.tasks}/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(input),
    },
    token,
  )

export const deleteTaskRequest = (token: string, id: string): Promise<void> =>
  request<void>(`${API_ROUTES.tasks}/${id}`, { method: 'DELETE' }, token)
