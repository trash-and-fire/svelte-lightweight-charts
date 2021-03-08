const {src, dest, parallel} = require('gulp');
// const typescript = require('gulp-typescript');
const {Transform} = require('stream');
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

function svelte() {
    return src(['./src/package/**/*.svelte'])
        .pipe(svelteTransform())
        .pipe(dest('./src/package/dist'));
}

const build = parallel(svelte);

module.exports = {
    build: build,
};
