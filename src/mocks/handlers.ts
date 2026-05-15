import { http, HttpResponse } from 'msw'
import { API_ROUTES, AUTH, STORAGE_KEYS, TASK_STATUS } from '../constants'
import type { Credentials, Task, TaskInput } from '../types'

const starterTasks: Task[] = [
  {
    id: '1',
    title: 'Prepare sprint board',
    description: 'Create tasks for this week and assign owners.',
    status: TASK_STATUS.todo,
  },
  {
    id: '2',
    title: 'Review design specs',
    description: 'Align stakeholders on the latest UI direction.',
    status: TASK_STATUS.inProgress,
  },
  {
    id: '3',
    title: 'Send weekly update',
    description: 'Share progress highlights with the team.',
    status: TASK_STATUS.done,
  },
  {
    id: '4',
    title: 'Plan roadmap focus',
    description: 'Pick the top three initiatives for next month.',
    status: TASK_STATUS.todo,
  },
]

const readTasks = (): Task[] => {
  const cached = globalThis.localStorage?.getItem(STORAGE_KEYS.tasks)

  if (!cached) {
    return [...starterTasks]
  }

  try {
    const parsed = JSON.parse(cached) as Task[]
    return Array.isArray(parsed) ? parsed : [...starterTasks]
  } catch {
    return [...starterTasks]
  }
}

const writeTasks = (tasks: Task[]) => {
  globalThis.localStorage?.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks))
}

let taskDb = readTasks()

const isAuthorized = (request: Request): boolean => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  return token === AUTH.fakeToken
}

export const handlers = [
  http.post(API_ROUTES.login, async ({ request }) => {
    const payload = (await request.json()) as Credentials

    if (payload.username !== AUTH.username || payload.password !== AUTH.password) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    return HttpResponse.json({ token: AUTH.fakeToken })
  }),

  http.get(API_ROUTES.tasks, ({ request }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    taskDb = readTasks()
    return HttpResponse.json(taskDb)
  }),

  http.post(API_ROUTES.tasks, async ({ request }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = (await request.json()) as TaskInput
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...payload,
    }
    taskDb = [newTask, ...taskDb]
    writeTasks(taskDb)
    return HttpResponse.json(newTask, { status: 201 })
  }),

  http.put(`${API_ROUTES.tasks}/:id`, async ({ request, params }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = (await request.json()) as TaskInput
    const taskId = params.id as string
    const existing = taskDb.find((task) => task.id === taskId)

    if (!existing) {
      return HttpResponse.json({ message: 'Task not found' }, { status: 404 })
    }

    taskDb = taskDb.map((task) =>
      task.id === taskId ? { ...task, ...payload } : task,
    )
    writeTasks(taskDb)
    return HttpResponse.json(taskDb.find((task) => task.id === taskId))
  }),

  http.delete(`${API_ROUTES.tasks}/:id`, ({ request, params }) => {
    if (!isAuthorized(request)) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const taskId = params.id as string
    taskDb = taskDb.filter((task) => task.id !== taskId)
    writeTasks(taskDb)
    return new HttpResponse(null, { status: 204 })
  }),
]

export const resetMockDb = () => {
  taskDb = readTasks()
}
