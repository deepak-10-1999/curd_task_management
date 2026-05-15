import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { makeStore } from '../app/store'

export const renderApp = (ui: React.ReactElement, route = '/dashboard') => {
  const store = makeStore()

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>,
    ),
  }
}
