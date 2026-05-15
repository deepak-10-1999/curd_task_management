import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { login } from '../app/store'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { APP_NAME } from '../constants'
import { cardStyle, fieldStyle, primaryButtonStyle } from './styles'

const LoginPage = () => {
  const dispatch = useAppDispatch()
  const { token, loading, error } = useAppSelector((state) => state.auth)
  const [username, setUsername] = useState('test')
  const [password, setPassword] = useState('test123')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await dispatch(login({ username, password }))
  }

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 px-4 py-10 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-slate-50">
      <section className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl shadow-indigo-100/60 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60 dark:shadow-none">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
              Premium workspace
            </span>
            <h1 className="mt-3 text-3xl font-bold">{APP_NAME}</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Plan, track, and ship with focus. Keep your day organized with a clean
              dashboard that prioritizes what matters.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Smart status lanes for clarity and flow.
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Quick task creation with guided fields.
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Secure demo workspace ready on first login.
            </div>
          </div>
        </div>

        <section className={`${cardStyle} self-start`}>
          <h2 className="text-lg font-semibold">Sign in</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Sign in to manage your tasks.
          </p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block text-sm font-medium" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className={fieldStyle}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <label className="block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className={fieldStyle}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? (
              <p role="alert" className="text-sm text-rose-600">
                {error}
              </p>
            ) : null}
            <button
              className={`${primaryButtonStyle} w-full`}
              disabled={loading}
              type="submit"
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Use <span className="font-semibold">test</span> /{' '}
              <span className="font-semibold">test123</span> for the demo.
            </p>
          </form>
        </section>
      </section>
    </main>
  )
}

export default LoginPage
