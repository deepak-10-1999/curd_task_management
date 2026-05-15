import { makeStore, seedDemoTask } from './store'

describe('store actions', () => {
  it('seeds demo task reducer branch', () => {
    const store = makeStore()
    store.dispatch(seedDemoTask())
    expect(store.getState().tasks.items[0].id).toBe('demo')
  })
})
