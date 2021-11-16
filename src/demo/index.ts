import './global.css';

import App from './app.svelte';

new App({
    target: document.body,
    props: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reference: (chart: unknown) => (window as any).chart = chart,
    }
});
