<svelte:options immutable={true}/>

<script lang="ts">
    import type {ChartOptions, IChartApi, DeepPartial, MouseEventParams} from 'lightweight-charts';
    import type {$$EVENTS_DETAIL, $$PROPS} from './chart.interface.js';
    import type {Reference} from '../internal/utils.js';

    import {createEventDispatcher} from 'svelte';
    import {element} from './internal/element.js';
    import ContextProvider from './internal/context-provider.svelte';
    import {chart} from '../internal/chart.js';

    const dispatch = createEventDispatcher<$$EVENTS_DETAIL>();

    export let container: $$PROPS['container'] = undefined;

    /** Height of the chart */
    export let width: $$PROPS['width'] = 0;
    /** Width of the chart */
    export let height: $$PROPS['height'] = 0;
    /**
     * Setting this flag to `true` will make the chart watch the chart container's size and automatically resize the chart to fit its container whenever the size changes.
     *
     * This feature requires [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) class to be available in the global scope.
     * Note that calling code is responsible for providing a polyfill if required. If the global scope does not have `ResizeObserver`, a warning will appear and the flag will be ignored.
     *
     * Please pay attention that `autoSize` option and explicit sizes options `width` and `height` don't conflict with one another.
     * If you specify `autoSize` flag, then `width` and `height` options will be ignored unless `ResizeObserver` has failed. If it fails then the values will be used as fallback.
     *
     * The flag `autoSize` could also be set with and unset with `applyOptions` function.
     * ```js
     * const chart = LightweightCharts.createChart(document.body, {
     *     autoSize: true,
     * });
     * ```
     */
    export let autoSize: $$PROPS['autoSize'] = undefined;
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
    /** Kinetic scroll options */
    export let kineticScroll: $$PROPS['kineticScroll'] = undefined;
    export let trackingMode: $$PROPS['trackingMode'] = undefined;

    export let ref: $$PROPS['ref'] = undefined;

    let options: DeepPartial<ChartOptions> | undefined = undefined;
    $: options = {
        width,
        height,
        autoSize,
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
        kineticScroll,
        trackingMode,
    };

    let reference: IChartApi | null = null;

    let handleReference: Reference<IChartApi> | undefined = undefined;
    $: handleReference = ((ref?: Reference<IChartApi>) => (chart: IChartApi | null) => {
        reference = chart;
        if (ref !== undefined) {
            ref(chart);
        }
    })(ref);

    // Dom container attributes
    let attrs: $$PROPS['container'] = {};
    $: {
        attrs = Object.assign({}, container);
        delete attrs.ref;
    }

    function handleCrosshairMove(params: MouseEventParams): void {
        dispatch('crosshairMove', params);
    }

    function handleClick(params: MouseEventParams): void {
        dispatch('click', params);
    }
</script>

<div
    {...attrs}
    style={autoSize ? attrs.style : (`width: ${width}px; height: ${height}px;` + attrs.style)}
    use:element={container ? container.ref : undefined}
    use:chart={{
        options,
        onCrosshairMove: handleCrosshairMove,
        onClick: handleClick,
        reference: handleReference,
    }}
>
    {#if reference !== null}
        <ContextProvider value={reference}><slot/></ContextProvider>
    {/if}
</div>
