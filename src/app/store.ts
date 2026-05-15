import {
  type PayloadAction,
  configureStore,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit'
import {
  createTaskRequest,
  deleteTaskRequest,
  getTasksRequest,
  loginRequest,
  updateTaskRequest,
} from '../api'
import { STORAGE_KEYS, TASK_STATUS } from '../constants'
import type { Credentials, Task, TaskInput } from '../types'

interface AuthState {
  token: string | null
  loading: boolean
  error: string | null
}

interface TasksState {
  items: Task[]
  loading: boolean
  error: string | null
}

const storedToken = globalThis.localStorage?.getItem(STORAGE_KEYS.token)

const initialAuthState: AuthState = {
  token: storedToken ?? null,
  loading: false,
  error: null,
}

const initialTasksState: TasksState = {
  items: [],
  loading: false,
  error: null,
}

export const login = createAsyncThunk<string, Credentials>(
  'auth/login',
  async (credentials) => {
    const result = await loginRequest(credentials)
    return result.token
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.error = null
      globalThis.localStorage?.removeItem(STORAGE_KEYS.token)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false
        state.token = action.payload
        globalThis.localStorage?.setItem(STORAGE_KEYS.token, action.payload)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Login failed'
      })
  },
})

const tokenFromState = (state: RootState): string => {
  if (!state.auth.token) {
    throw new Error('You must be logged in.')
  }

  return state.auth.token
}

export const fetchTasks = createAsyncThunk<Task[], void, { state: RootState }>(
  'tasks/fetch',
  async (_, { getState }) => {
    return getTasksRequest(tokenFromState(getState()))
  },
)

export const createTask = createAsyncThunk<
  Task,
  TaskInput,
  { state: RootState }
>('tasks/create', async (input, { getState }) => {
  return createTaskRequest(tokenFromState(getState()), input)
})

export const updateTask = createAsyncThunk<
  Task,
  { id: string; input: TaskInput },
  { state: RootState }
>('tasks/update', async ({ id, input }, { getState }) => {
  return updateTaskRequest(tokenFromState(getState()), id, input)
})

export const deleteTask = createAsyncThunk<
  string,
  string,
  { state: RootState }
>('tasks/delete', async (id, { getState }) => {
  await deleteTaskRequest(tokenFromState(getState()), id)
  return id
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialTasksState,
  reducers: {
    clearTasks: (state) => {
      state.items = []
      state.error = null
      state.loading = false
      globalThis.localStorage?.setItem(STORAGE_KEYS.tasks, JSON.stringify([]))
    },
    seedDemoTask: (state) => {
      state.items = [
        {
          id: 'demo',
          title: 'Welcome task',
          description: 'Create, edit, and complete your tasks.',
          status: TASK_STATUS.todo,
        },
      ]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Unable to fetch tasks'
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items = state.items.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        )
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((task) => task.id !== action.payload)
      })
      .addMatcher(
        (action: { type: string }) =>
          action.type.startsWith('tasks/') && action.type.endsWith('/rejected'),
        (state, action: { error?: { message?: string } }) => {
          state.error = action.error?.message ?? 'Task operation failed'
        },
      )
  },
})

export const { logout } = authSlice.actions
export const { clearTasks, seedDemoTask } = tasksSlice.actions

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authSlice.reducer,
      tasks: tasksSlice.reducer,
    },
  })

export const store = makeStore()

store.subscribe(() => {
  globalThis.localStorage?.setItem(
    STORAGE_KEYS.tasks,
    JSON.stringify(store.getState().tasks.items),
  )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
