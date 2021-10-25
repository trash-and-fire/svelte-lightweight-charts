/// <reference types="jest"/>

import ContextProvider from '../components/internal/context-provider.svelte'

describe('ContextProvider', () => {
  it('should render', () => {
    const el = document.createElement('div')
    new ContextProvider({
      target: el
    })
    expect(el.textContent).toBe('')
  })
})
