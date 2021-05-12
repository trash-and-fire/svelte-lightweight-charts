const {preprocess, compile} = require('svelte/compiler');
const {typescript} = require('svelte-preprocess');

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
module.exports = {
    async processAsync(src, filename) {
        const ts = typescript();
        ts.filename = filename;
        const { code } = await preprocess(src, ts);
        return compiler(code, filename);
    }
}
