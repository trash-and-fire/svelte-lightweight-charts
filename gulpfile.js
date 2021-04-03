const {src, dest, parallel, series} = require('gulp');
const rename = require('gulp-rename');
const transform = require('gulp-transform');
const {preprocess} = require('svelte/compiler');
const camelize = require('lodash/camelCase');
const upper = require('lodash/upperFirst')
const remove = require('gulp-clean');
const {exec} = require('child_process');

function convertToTypings(content, file) {
    const filename = file.basename[0].toUpperCase() + file.basename.slice(1);
    const header = `import { SvelteComponentTyped } from 'svelte';`;
    const name = upper(camelize(filename.replace(/\.interface.ts$/, '')));
    const trailer = `export default class ${name} extends SvelteComponentTyped<$$PROPS, $$EVENTS> {}`;

    return [header, content, trailer].join('\n');
}

function typings() {
    return src(['./src/package/**/*.interface.ts'])
        .pipe(transform('utf8', convertToTypings))
        .pipe(rename((path) => {
            path.basename = path.basename.replace(/\.interface$/, '.svelte');
            path.extname = '.d.ts';
        }))
        .pipe(dest('./dist'));
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
        .pipe(dest('./dist'));
}

function clean() {
    return src(['./dist/**/*.interface.js', './dist/**/*.interface.d.ts'], { read: false })
        .pipe(remove());
}

function wipe() {
    return src(['./dist'], { read: false, allowEmpty: true })
        .pipe(remove());
}

function manifest() {
    return src(['./package.json'])
        .pipe(transform('utf8', (content) => {
            const json = JSON.parse(content);
            delete json.private;
            return JSON.stringify(json, null, '  ');
        }))
        .pipe(dest('./dist'));
}

function typescript(callback) {
    exec('tsc --project tsconfig.build.json', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
}

const build = series(wipe, typescript, parallel(manifest, svelte, typings), clean);

module.exports = {
    build,
};
