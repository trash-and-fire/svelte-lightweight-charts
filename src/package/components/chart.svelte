<svelte:options immutable={true}/>

<script lang="ts">
    import type {ChartOptions, IChartApi, DeepPartial, MouseEventParams} from 'lightweight-charts';
    import type {$$EVENTS, $$PROPS} from './chart.interface';
    import type {Reference} from '../types';

    import {createEventDispatcher} from 'svelte';
    import ContextProvider from './internal/context-provider.svelte';
    import {chart} from '../index';

    const dispatch = createEventDispatcher<$$EVENTS>();

    /** Height of the chart */
    export let width: $$PROPS['width'] = 0;
    /** Width of the chart */
    export let height: $$PROPS['height'] = 0;
    /** Structure with watermark options */
    export let watermark: $$PROPS['watermark'] = undefined;
    /** Structure with layout options */
    export let layout: $$PROPS['layout'] = undefined;
    /** Structure with price scale option for left price scale */
    export let leftPriceScale: $$PROPS['leftPriceScale'] = undefined;
    /** Structure with price scale option for right price scale */
    export let rightPriceScale: $$PROPS['rightPriceScale'] = undefined;
    /** Structure describing default price scale options for overlays */
    export let overlayPriceScales: $$PROPS['overlayPriceScales'] = undefined;
    /** Structure with time scale options */
    export let timeScale: $$PROPS['timeScale'] = undefined;
    /** Structure with crosshair options */
    export let crosshair: $$PROPS['crosshair'] = undefined;
    /** Structure with grid options */
    export let grid: $$PROPS['grid'] = undefined;
    /** Structure with localization options */
    export let localization: $$PROPS['localization'] = undefined;
    /** Structure that describes scrolling behavior or boolean flag that disables/enables all kinds of scrolls */
    export let handleScroll: $$PROPS['handleScroll'] = undefined;
    /** Structure that describes scaling behavior or boolean flag that disables/enables all kinds of scales */
    export let handleScale: $$PROPS['handleScale'] = undefined;

    export let ref: $$PROPS['ref'] = undefined;

    let options: DeepPartial<ChartOptions> | undefined = undefined;
    $: options = {
        width,
        height,
        watermark,
        layout,
        leftPriceScale,
        rightPriceScale,
        overlayPriceScales,
        timeScale,
        crosshair,
        grid,
        localization,
        handleScroll,
        handleScale,
    };

    let reference: IChartApi | null = null;

    let handleReference: Reference<IChartApi> | undefined = undefined;
    $: handleReference = ((ref?: Reference<IChartApi>) => (chart: IChartApi | null) => {
        reference = chart;
        if (ref !== undefined) {
            ref(chart);
        }
    })(ref);

    function handleCrosshairMove(params: MouseEventParams): void {
        dispatch('crosshairMove', params);
    }

    function handleClick(params: MouseEventParams): void {
        dispatch('click', params);
    }
</script>

<div use:chart={{
    options,
    onCrosshairMove: handleCrosshairMove,
    onClick: handleClick,
    reference: handleReference,
}}>
    {#if reference !== null}
        <ContextProvider value={reference}><slot/></ContextProvider>
    {/if}
</div>
