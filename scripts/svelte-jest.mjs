import {preprocess, compile} from 'svelte/compiler';
import preprocessors from 'svelte-preprocess';

function compiler(src, filename) {
  const result = compile(src, {
    filename,
    // Allow tests to set component props.
    accessors: true,
    // Debugging and runtime checks.
    dev: true,
    format: 'esm'
  })

  return {
    code: result.js.code,
    map: result.js.map
  }
}
export default {
    async processAsync(src, filename) {
        const ts = preprocessors.typescript();
        ts.filename = filename;
        const { code } = await preprocess(src, ts);
        return compiler(code, filename);
    },
    process() {
        throw new Error('not implemented');
    }
}
