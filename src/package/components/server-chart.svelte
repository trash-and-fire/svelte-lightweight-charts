<svelte:options immutable={true}/>

<script lang="ts">
    import type {$$PROPS} from './server-chart.interface.js';
    import {ChartOptions, DeepPartial} from 'lightweight-charts';

    export let container: $$PROPS['container'] = undefined;

    /** Height of the chart */
    export let width: $$PROPS['width'] = 0;
    /** Width of the chart */
    export let height: $$PROPS['height'] = 0;

    // Describe and use other props to mute svelte warnings

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mute = ref;

    // Dom container attributes
    let attrs: $$PROPS['container'] = {};
    $: {
        attrs = Object.assign({}, container);
        delete attrs.ref;
    }
</script>

<div {...attrs}>
    <div style:width={width + 'px'} style:height={height + 'px'}></div>
</div>
