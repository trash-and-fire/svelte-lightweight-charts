<script>
    import repl from './repl.json';
    // eslint-disable-next-line no-undef
    const context = require.context('./samples', false, /\.svelte$/);

    // eslint-disable-next-line @typescript-eslint/typedef
    const components = context.keys().map((request) => {
        const [file] = /(\w|[-.])+$/.exec(request);
        const id = repl.samples[file]?.uid;
        return {
            href: id !== undefined ? `https://svelte.dev/repl/${id}` : undefined,
            constructor: context(request).default,
        }
    });
</script>

<div class="container">
    {#each components as component (component)}
        <div class="item">
            {#if component.href !== undefined}
                <a class="link" target="_blank" href={component.href} title="Show in REPL" rel="noreferrer">
                    <svg width="18" height="15" viewBox="0 0 18 15" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="currentColor" fill="none">
                            <path d="M12.5 2.5l5 5-5 5M10.5.5l-3 14M5.5 2.5l-5 5 5 5"></path>
                        </g>
                    </svg>
                </a>
            {/if}
            <svelte:component this={component.constructor}/>
        </div>
    {/each}
</div>

<style>
    .container {
        display: flex;
        width: 100%;

        flex-wrap: wrap;
        justify-content: center;
        margin: 0 -20px 0;
        padding-bottom: 30px;
    }

    .item {
        position: relative;
        flex: none;
        margin: 0 20px 0;
        z-index: 0;
    }

    .link:link,
    .link:visited {
        position: absolute;
        color: inherit;
        display: flex;
        font-size: 2em;
        top: 0.67em;
        right: 0;
        height: 34px;
        width: 34px;
        border-radius: 50%;
        padding: 7px;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }
    .link:hover {
        background: #f2f3f5;
    }
</style>
