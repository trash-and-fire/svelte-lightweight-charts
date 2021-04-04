const axios = require('axios').default;

module.exports = class SvelteReplRepository {
    constructor(auth) {
        if (!auth) {
            throw new Error('No auth token')
        }
        axios.defaults.headers.common.cookie = `sid=${auth};`
        axios.defaults.headers.post['Content-Type'] = 'text/plain;charset=UTF-8';
        axios.defaults.headers.patch['Content-Type'] = 'text/plain;charset=UTF-8';
    }

    getAll() {
        return axios.get('https://svelte.dev/apps.json').then((response) => response.data);
    }

    create(name, files) {
        return axios.post('https://svelte.dev/repl/create.json', JSON.stringify({ name, files }))
            .then((response) => response.data);
    }

    update(id, name, files) {
        return axios.patch(`https://svelte.dev/repl/${id}.json`, JSON.stringify({ name, files }))
            .then((response) => response.data);
    }
}
