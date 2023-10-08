<svelte:options immutable={true}/>

<script lang="ts">
    import type {ISeriesApi} from 'lightweight-charts';
    import type {$$PROPS} from './custom-series.interface.js';
    import type {Reference} from '../internal/utils.js';

    import ContextProvider from './internal/context-provider.svelte';
    import {useSeriesEffect} from './internal/utils.js';

    export let ref: $$PROPS['ref'] = undefined;

    export let view: $$PROPS['view'];
    export let options: $$PROPS['options'];
    export let data: $$PROPS['data'] = [];
    export let reactive: $$PROPS['reactive'] = false;
    export let markers: NonNullable<$$PROPS['markers']> = [];

    let reference: ISeriesApi<'Custom'> | null = null;

    let handleReference: Reference<ISeriesApi<'Custom'>> | undefined = undefined;
    $: handleReference = ((ref?: Reference<ISeriesApi<'Custom'>>) => (series: ISeriesApi<'Custom'> | null) => {
        reference = series;
        if (ref !== undefined) {
            ref(series);
        }
    })(ref);

    const id = performance.now().toString();
    useSeriesEffect(() => [
        {
            id,
            type: 'Custom',
            view,
            reactive,
            options,
            data,
            markers,
        },
        handleReference,
    ]);
</script>
{#if reference !== null}
    <ContextProvider value={reference}>
        <slot/>
    </ContextProvider>
{/if}
