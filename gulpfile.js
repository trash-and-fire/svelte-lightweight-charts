const {src, dest, parallel, series} = require('gulp');
const rename = require('gulp-rename');
const transform = require('gulp-transform');
const {preprocess} = require('svelte/compiler');
const camelize = require('lodash/camelCase');
const upper = require('lodash/upperFirst')
const remove = require('gulp-clean');
const {spawn} = require('child_process');
const crc = require('crc-32');
const {argv} = require('yargs');

const SvelteReplRepository = require('./repl-maker');

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

function typescript() {
    return spawn('tsc', ['--project', 'tsconfig.build.json'], { stdio: 'inherit' });
}

function assets() {
    return src(['README.md'])
        .pipe(dest('./dist'));
}

function repl() {
    if (argv.repl) {
        return src(['./dist/**/*.svelte', './dist/**/*.js'])
            .pipe(transform('utf8', (content) => {
                return content.toString().replace(/'lightweight-charts'/g, "'lightweight-charts?module'")
            }))
            .pipe(dest('./dist'));
    } else {
        return src(['./']);
    }
}

const build = series(wipe, typescript, parallel(manifest, svelte, typings, assets), clean, repl);

function samples(...args) {
    const components = new Map();
    const samples = new Map();

    const repository = new SvelteReplRepository(argv.auth);

    const resolveComponents = () => src(['./src/demo/samples/components/*.svelte'])
        .pipe(transform('utf8', (contents, file) => {
            return applyPreprocess(contents, file).then((code) => {
                components.set(`components/${file.basename}`, {
                    hash: crc.str(contents),
                    name: file.basename,
                    contents: code,
                });
                return code;
            });
        }));

    const resolveSamples = () => src(['./src/demo/samples/*.svelte'])
        .pipe(transform('utf8', (contents, file) => {
            contents = contents.toString().replace(/'lightweight-charts'/g, "'lightweight-charts?module'")
            contents = contents.toString().replace(/svelte-lightweight-charts/g, 'svelte-lightweight-charts@repl');

            const issue =
`
<script>
    /**
     * Warning:
     * Until the issue [https://github.com/sveltejs/svelte-repl/issues/177] is resolved
     * you should use imports from 'svelte-lightweight-charts@repl' and 'lightweight-charts?module' in REPL
     */
`
            contents = contents.toString().replace(/<script>/g, issue);


            const files = Array.from(components.keys()).filter((file) => contents.includes(file));
            samples.set(`${file.basename}`, {
                hash: crc.str(contents),
                name: file.basename,
                contents,
                files,
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
            for (const [component, meta] of components.entries()) {
                next.components[component] = Object.assign({}, contents.components[component], {
                    hash: meta.hash,
                })
            }
            const promises = [];
            for (const [sample, meta] of samples.entries()) {
                const files = meta.files.map((file) => {
                    return {
                        name: file,
                        source: components.get(file).contents,
                    }
                })
                // eslint-disable-next-line no-prototype-builtins
                if (!contents.samples.hasOwnProperty(sample)) {
                    console.log(`Creating repl for "${sample}"`);
                    promises.push(repository.create(`test/svelte-lightweight-charts/${sample}`, [{
                        name: 'App.svelte',
                        source: meta.contents,
                    }, ...files]).then((result) => {
                        next.samples[sample] = Object.assign({}, contents.samples[sample], {
                            hash: meta.hash,
                            uid: result.id,
                            files: meta.files,
                        });
                    }));
                } else {
                    const isComponentsChanged = meta.files.some((file) => {
                        // eslint-disable-next-line no-prototype-builtins
                        if (!contents.components.hasOwnProperty(file)) {
                            return true;
                        }
                        if (!components.get(file)) {
                            return true;
                        }
                        const record = contents.components[file];
                        return record.hash !== components.get(file).hash;
                    })
                    if (contents.samples[sample].hash !== meta.hash || isComponentsChanged) {
                        const uid = contents.samples[sample].uid;
                        if (!uid) {
                            throw new Error('no id')
                        }
                        console.log(`Updating repl for "${sample}"`);
                        promises.push(repository.update(uid, `test/svelte-lightweight-charts/${sample}`, [{
                            name: 'App.svelte',
                            source: meta.contents,
                        }, ...files]).then(() => {
                            next.samples[sample] = Object.assign({}, contents.samples[sample], {
                                hash: meta.hash,
                                files: meta.files,
                            });
                        }))
                    } else {
                        next.samples[sample] = Object.assign({}, contents.samples[sample]);
                    }
                }

            }
            return Promise.all(promises).then(() => JSON.stringify(next, null, '  '));
        }))
        .pipe(dest('./src/demo/'));

    return series(resolveComponents, resolveSamples, createJSON)(...args);
}

module.exports = {
    build,
    samples,
};
