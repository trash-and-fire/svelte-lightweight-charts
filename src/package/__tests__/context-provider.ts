/// <reference types="jest"/>

import ContextProvider from '../components/internal/context-provider.svelte'

describe('Foo Component', () => {
  it('should render', () => {
    const el = document.createElement('div')
    new ContextProvider({
      target: el
    })
    expect(el.textContent).toBe('Hello Foo!')
  })
})
