import {describe, it, expect} from '@jest/globals';

import ContextProvider from '../context-provider.svelte';

describe('ContextProvider', () => {
  it('should render', () => {
    const el = document.createElement('div')
    new ContextProvider({
      target: el,
      props: {
        value: {},
      }
    })
    expect(el.textContent).toBe('')
  })
})
