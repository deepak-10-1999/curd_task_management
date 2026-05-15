import { http, HttpResponse } from 'msw'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { API_ROUTES } from './constants'
import { server } from './test/setup'
import { renderApp } from './test/test-utils'

describe('Task manager app', () => {
  it('redirects unauthenticated users to login and shows auth error', async () => {
    const { store } = renderApp(<App />, '/dashboard')

    await screen.findByRole('heading', { name: 'Task Manager' })

    await userEvent.clear(screen.getByLabelText('Username'))
    await userEvent.type(screen.getByLabelText('Username'), 'bad')
    await userEvent.clear(screen.getByLabelText('Password'))
    await userEvent.type(screen.getByLabelText('Password'), 'creds')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials')
    expect(store.getState().auth.token).toBeNull()
  })

  it('supports task CRUD and logout', async () => {
    renderApp(<App />, '/login')

    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await screen.findByRole('heading', { name: 'Dashboard' })
    await screen.findByText('Prepare sprint board')

    await userEvent.click(screen.getByRole('button', { name: 'New task' }))
    await userEvent.type(screen.getByLabelText('Title'), 'New Task')
    await userEvent.type(screen.getByLabelText('Description'), 'Ship release')
    await userEvent.selectOptions(screen.getByLabelText('Status'), 'done')
    await userEvent.click(screen.getByRole('button', { name: 'Add task' }))

    await screen.findByText('New Task')

    await userEvent.click(
      screen
        .getByText('New Task')
        .closest('li')!
        .querySelector('button')!,
    )

    await userEvent.clear(screen.getByLabelText('Title'))
    await userEvent.type(screen.getByLabelText('Title'), 'Updated Task')
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    await screen.findByText('Updated Task')

    const updatedItem = screen.getByText('Updated Task').closest('li')!
    await userEvent.click(updatedItem.querySelectorAll('button')[1])

    await waitFor(() => {
      expect(screen.queryByText('Updated Task')).not.toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: 'Logout' }))
    await screen.findByRole('heading', { name: 'Task Manager' })
  })

  it('shows empty and server error states', async () => {
    renderApp(<App />, '/login')

    await userEvent.click(screen.getByRole('button', { name: 'Login' }))
    await screen.findByText('Prepare sprint board')

    const deleteButtons = await screen.findAllByRole('button', { name: 'Delete task' })
    for (const button of deleteButtons) {
      await userEvent.click(button)
    }

    expect(
      await screen.findByText('No tasks yet. Use the New task button to get started.'),
    ).toBeInTheDocument()

    server.use(
      http.get(API_ROUTES.tasks, () =>
        HttpResponse.json({ message: 'Broken tasks API' }, { status: 500 }),
      ),
    )

    await userEvent.click(screen.getByRole('button', { name: 'Logout' }))
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Broken tasks API')
  })

  it('validates form fields and cancel edit action', async () => {
    renderApp(<App />, '/login')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))
    await screen.findByRole('heading', { name: 'Dashboard' })

    await userEvent.click(screen.getByRole('button', { name: 'New task' }))
    await userEvent.clear(screen.getByLabelText('Title'))
    await userEvent.clear(screen.getByLabelText('Description'))
    await userEvent.click(screen.getByRole('button', { name: 'Add task' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Title and description are required',
    )

    const firstEditButton = screen
      .getByText('Prepare sprint board')
      .closest('li')!
      .querySelector('button')!

    await userEvent.click(firstEditButton)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(
      screen.queryByRole('button', { name: 'Save changes' }),
    ).not.toBeInTheDocument()
  })
})
