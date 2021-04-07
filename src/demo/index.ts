import './global.css';

import App from './app.svelte';

new App({
    target: document.body,
    props: {
        reference: (chart: unknown) => (window as any).chart = chart,
    }
});
