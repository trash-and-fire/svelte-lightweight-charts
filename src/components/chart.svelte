<svelte:options immutable={true}/>

<script context="module" lang="ts">
    import {chart} from '..';
</script>
<script lang="ts">
    import type {ChartOptions, IChartApi, DeepPartial} from 'lightweight-charts';
    import {context} from './utils';

    /** Height of the chart */
    export let width: DeepPartial<DeepPartial<ChartOptions['width']>> = 0;
    /** Width of the chart */
    export let height: DeepPartial<ChartOptions['height']> = 0;
    /** Structure with watermark options */
    export let watermark: DeepPartial<ChartOptions['watermark']> | undefined = undefined;
    /** Structure with layout options */
    export let layout: DeepPartial<ChartOptions['layout']> | undefined = undefined;
    /** Structure with price scale option for left price scale */
    export let leftPriceScale: DeepPartial<ChartOptions['leftPriceScale']> | undefined = undefined;
    /** Structure with price scale option for right price scale */
    export let rightPriceScale: DeepPartial<ChartOptions['rightPriceScale']> | undefined = undefined;
    /** Structure describing default price scale options for overlays */
    export let overlayPriceScales: DeepPartial<ChartOptions['overlayPriceScales']> | undefined = undefined;
    /** Structure with time scale options */
    export let timeScale: DeepPartial<ChartOptions['timeScale']> | undefined = undefined;
    /** Structure with crosshair options */
    export let crosshair: DeepPartial<ChartOptions['crosshair']> | undefined = undefined;
    /** Structure with grid options */
    export let grid: DeepPartial<ChartOptions['grid']> | undefined = undefined;
    /** Structure with localization options */
    export let localization: DeepPartial<ChartOptions['localization']> | undefined = undefined;
    /** Structure that describes scrolling behavior or boolean flag that disables/enables all kinds of scrolls */
    export let handleScroll: DeepPartial<ChartOptions['handleScroll']> | undefined = undefined;
    /** Structure that describes scaling behavior or boolean flag that disables/enables all kinds of scales */
    export let handleScale: DeepPartial<ChartOptions['handleScale']> | undefined = undefined;

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

    $: if (reference !== null) {
        context(reference);
    }

    function handleReference(ref: IChartApi | null): void {
        reference = ref;
    }
</script>

<div use:chart={{
    options,
    reference: handleReference,
}}>
    {#if reference !== null}<slot/>{/if}
</div>
