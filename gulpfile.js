const {src, dest, parallel} = require('gulp');
// const typescript = require('gulp-typescript');
const rename = require('gulp-rename');
const transform = require('gulp-transform');
const {preprocess} = require('svelte/compiler');

// const tsProject = typescript.createProject('tsconfig.build.json');

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

async function applyPreprocess(content, file) {
    const ts = require('svelte-preprocess').typescript();
    ts.filename = file.basename;
    // TODO: remove source mapping url
    const garbage = require('svelte-preprocess').replace([
        [/<!--[^]*?-->|<script(\s[^]*?)?(?:>([^]*?)<\/script>|\/>)/gi, (value, attributes) => {
            if (attributes !== undefined && attributes.includes('lang="ts"')) {
                return value.replace('lang="ts"', '');
            }
            return value;
        }]
    ]);
    garbage.filename = file.basename;
    content = await preprocess(content, ts);
    content = await preprocess(content.code, garbage);
    return content.code;
}

function svelte() {
    return src(['./src/package/**/*.svelte'])
        .pipe(transform('utf8', applyPreprocess))
        .pipe(dest('./src/package/dist'));
}

const build = parallel(svelte, typings);

module.exports = {
    build: build,
};
