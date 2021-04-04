const {src, dest, parallel, series} = require('gulp');
const rename = require('gulp-rename');
const transform = require('gulp-transform');
const {preprocess} = require('svelte/compiler');
const camelize = require('lodash/camelCase');
const upper = require('lodash/upperFirst')
const remove = require('gulp-clean');
const {exec} = require('child_process');
const crc = require('crc-32');

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
            delete json.scripts;
            delete json.husky;
            delete json.engines;
            delete json['lint-staged'];
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

function samples(...args) {
    const components = new Map();
    const samples = new Map();

    const resolveComponents = () => src(['./src/demo/samples/components/*.svelte'])
        .pipe(transform('utf8', (contents, file) => {
            components.set(`components/${file.basename}`, {
                hash: crc.str(contents),
                name: file.basename,
            });
            return contents;
        }));

    const resolveSamples = () => src(['./src/demo/samples/*.svelte'])
        .pipe(transform('utf8', (contents, file) => {
            samples.set(`${file.basename}`, {
                hash: crc.str(contents),
                name: file.basename,
            });
            return contents;
        }));

    const createJSON = () => src(['./src/demo/repl.json'])
        .pipe(transform('utf8', (contents) => {
            contents = JSON.parse(contents);

            const next = {
                samples: {},
                components: {},
            };
            let componentChanged = false;
            for (const [component, meta] of components.entries()) {
                // eslint-disable-next-line no-prototype-builtins
                if (!contents.components.hasOwnProperty(component) || contents.components[component].hash !== meta.hash) {
                    componentChanged = true;
                }
                next.components[component] = Object.assign({}, contents.components[component], {
                    hash: meta.hash,
                })
            }
            for (const [sample, meta] of samples.entries()) {
                // eslint-disable-next-line no-prototype-builtins
                if (!contents.samples.hasOwnProperty(sample)) {
                    // create repl
                } else {
                    if (contents.samples[sample].hash !== meta.hash || componentChanged) {
                        // update repl
                    }
                }
                next.samples[sample] = Object.assign({}, contents.samples[sample], {
                    hash: meta.hash,
                })
            }
            return JSON.stringify(next, null, '  ');
        }))
        .pipe(dest('./temp'));

    return series(parallel(resolveComponents, resolveSamples), createJSON)(...args);
}

module.exports = {
    build,
    samples,
};
