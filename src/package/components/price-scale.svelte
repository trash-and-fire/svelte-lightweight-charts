<svelte:options immutable={true}/>

<script lang="ts">
    import type {PriceScaleOptions, DeepPartial} from 'lightweight-charts';
    import type {$$PROPS} from './price-scale.interface.js';

    import {usePriceScaleEffect} from './internal/utils.js';

    export let id: string;
    /**
     * Automatically set price range based on visible data range.
     */
    export let autoScale: $$PROPS['autoScale'] | undefined = undefined;
    /** Price scale mode. */
    export let mode: $$PROPS['mode'] | undefined = undefined;
    /**
     * Invert the price scale, so that a upwards trend is shown as a downwards trend and vice versa.
     * Affects both the price scale and the data on the chart.
     */
    export let invertScale: $$PROPS['invertScale'] | undefined = undefined;
    /**
     * Align price scale labels to prevent them from overlapping.
     */
    export let alignLabels: $$PROPS['alignLabels'] | undefined = undefined;
    /**
     * Price scale margins.
     */
    export let scaleMargins: $$PROPS['scaleMargins'] | undefined = undefined;
    /**
     * Set true to draw a border between the price scale and the chart area.
     */
    export let borderVisible: $$PROPS['borderVisible'] | undefined = undefined;
    /**
     * Price scale border color.
     */
    export let borderColor: $$PROPS['borderColor'] | undefined = undefined;
    /**
     * Price scale text color.
     * If not provided {@link LayoutOptions.textColor} is used.
     */
    export let textColor: $$PROPS['textColor'] | undefined = undefined;
    /**
     * Show top and bottom corner labels only if entire text is visible.
     */
    export let entireTextOnly: $$PROPS['entireTextOnly'] | undefined = undefined;
    /** Indicates if this price scale visible. Ignored by overlay price scales. */
    export let visible: $$PROPS['visible'] | undefined = undefined;
    /** Draw small horizontal line on price axis labels. */
    export let ticksVisible: $$PROPS['ticksVisible'] | undefined = undefined;

    export let ref: $$PROPS['ref'] = undefined;

    let options: DeepPartial<PriceScaleOptions> = {
        autoScale,
        mode,
        invertScale,
        alignLabels,
        scaleMargins,
        borderVisible,
        borderColor,
        textColor,
        entireTextOnly,
        visible,
        ticksVisible,
    };

    $: options = {
        autoScale,
        mode,
        invertScale,
        alignLabels,
        scaleMargins,
        borderVisible,
        borderColor,
        textColor,
        entireTextOnly,
        visible,
        ticksVisible,
    };

    usePriceScaleEffect(() => [
        {
            id,
            options,
        },
        ref
    ]);
</script>
