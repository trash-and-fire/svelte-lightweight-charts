const {src, dest, parallel} = require('gulp');
// const typescript = require('gulp-typescript');
const {Transform} = require('stream');
const rename = require('gulp-rename');
const transform = require('gulp-transform');
const {compile, preprocess} = require('svelte/compiler');
const PluginError = require('plugin-error');

// const tsProject = typescript.createProject('tsconfig.build.json');

function svelteTransform() {
    return new Transform({
        objectMode: true,
        async transform(file, enc, cb) {
            if (file.isNull()) {
                cb(null, file);
                return;
            }

            try {
                const source = file.contents.toString();

                const options = require('svelte-preprocess')({sourceMap: false});
                options.filename = file.path;
                const preprocessed = await preprocess(source, options);
                const {js} = compile(preprocessed.toString(), { filename: file.path });
                file.contents = Buffer.from(js.code);
                file.extname = '.svelte.js';

                cb(null, file);
            } catch (err) {
                if (file.path) {
                    err.fileName = file.path;
                }

                cb(new PluginError('gulp-svelte', err));
            }
        }
    });
}

// function scripts() {
//     return src(['./src/package/**/*.ts'])
//         .pipe(tsProject())
//         .pipe(dest('./src/package/dist'));
// }

function convertToTypings(content, file) {
    const filename = file.basename[0].toUpperCase() + file.basename.slice(1);
    const header = `import { SvelteComponentTyped } from 'svelte';`;
    const trailer = `export default class ${filename.replace(/\.interface.ts$/, '')}__SvelteComponent extends SvelteComponentTyped<$$PROPS, $$EVENTS> {}`;

    return [header, content, trailer].join('\n');
}

function typings() {
    return src(['./src/package/**/*.interface.ts'])
        .pipe(transform('utf8', convertToTypings))
        .pipe(rename((path) => {
            path.basename = path.basename.replace(/\.interface$/, '.svelte');
            path.extname = '.d.ts';
        }))
        .pipe(dest('./src/package/dist'));
}

function svelte() {
    return src(['./src/package/**/*.svelte'])
        .pipe(svelteTransform())
        .pipe(dest('./src/package/dist'));
}

const build = parallel(svelte, typings);

module.exports = {
    build: build,
};
