<svelte:options immutable={true}/>

<script lang="ts">
    import type {BaselineSeriesPartialOptions, ISeriesApi} from 'lightweight-charts';
    import type {$$PROPS} from './baseline-series.interface.js';
    import type {Reference} from '../internal/utils.js';

    import ContextProvider from './internal/context-provider.svelte';
    import {useSeriesEffect} from './internal/utils.js';

    /** Visibility of the label with the latest visible price on the price scale */
    export let lastValueVisible: $$PROPS['lastValueVisible'] = undefined;
    /** Title of the series. This label is placed with price axis label */
    export let title: $$PROPS['title'] = undefined;
    /** Target price scale to bind new series to */
    export let priceScaleId: $$PROPS['priceScaleId'] = undefined;
    /** Visibility of series. */
    export let visible: $$PROPS['visible'] = undefined;
    /** Visibility of the price line. Price line is a horizontal line indicating the last price of the series */
    export let priceLineVisible: $$PROPS['priceLineVisible'] = undefined;
    /** Enum of possible modes of priceLine source */
    export let priceLineSource: $$PROPS['priceLineSource'] = undefined;
    /** Width of the price line. Ignored if priceLineVisible is false */
    export let priceLineWidth: $$PROPS['priceLineWidth'] = undefined;
    /** Color of the price line. Ignored if priceLineVisible is false */
    export let priceLineColor: $$PROPS['priceLineColor'] = undefined;
    /** Price line style. Suitable for percentage and indexedTo100 scales */
    export let priceLineStyle: $$PROPS['priceLineStyle'] = undefined;
    /** Formatting settings associated with the series */
    export let priceFormat: $$PROPS['priceFormat'] = undefined;
    /** Visibility of base line. Suitable for percentage and indexedTo100 scales */
    export let baseLineVisible: $$PROPS['baseLineVisible'] = undefined;
    /** Color of the base line in IndexedTo100 mode */
    export let baseLineColor: $$PROPS['baseLineColor'] = undefined;
    /** Base line width. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineWidth: $$PROPS['baseLineWidth'] = undefined;
    /** Base line style. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineStyle: $$PROPS['baseLineStyle'] = undefined;
    /** function that overrides calculating of visible prices range */
    export let autoscaleInfoProvider: $$PROPS['autoscaleInfoProvider'] = undefined;

    /**
     * Base value of the series.
     */
    export let baseValue: $$PROPS['baseValue'] = undefined;
    /**
     * The first color of the top area.
     */
    export let topFillColor1: $$PROPS['topFillColor1'] = undefined;
    /**
     * The second color of the top area.
     */
    export let topFillColor2: $$PROPS['topFillColor2'] = undefined;
    /**
     * The line color of the top area.
     */
    export let topLineColor: $$PROPS['topLineColor'] = undefined;
    /**
     * The first color of the bottom area.
     */
    export let bottomFillColor1: $$PROPS['bottomFillColor1'] = undefined;
    /**
     * The second color of the bottom area.
     */
    export let bottomFillColor2: $$PROPS['bottomFillColor2'] = undefined;
    /**
     * The line color of the bottom area.
     */
    export let bottomLineColor: $$PROPS['bottomLineColor'] = undefined;
    /**
     * Line width.
     */
    export let lineWidth: $$PROPS['lineWidth'] = undefined;
    /**
     * Line style.
     */
    export let lineStyle: $$PROPS['lineStyle'] = undefined;
    /**
     * Show the crosshair marker.
     */
    export let crosshairMarkerVisible: $$PROPS['crosshairMarkerVisible'] = undefined;
    /**
     * Crosshair marker radius in pixels.
     */
    export let crosshairMarkerRadius: $$PROPS['crosshairMarkerRadius'] = undefined;
    /**
     * Crosshair marker border color. An empty string falls back to the the color of the series under the crosshair.
     */
    export let crosshairMarkerBorderColor: $$PROPS['crosshairMarkerBorderColor'] = undefined;
    /**
     * The crosshair marker background color. An empty string falls back to the the color of the series under the crosshair.
     */
    export let crosshairMarkerBackgroundColor: $$PROPS['crosshairMarkerBackgroundColor'] = undefined;
    /**
     * Last price animation mode.
     */
    export let lastPriceAnimation: $$PROPS['lastPriceAnimation'] = undefined;

    export let ref: $$PROPS['ref'] = undefined;

    export let data: $$PROPS['data'] = [];
    export let reactive: $$PROPS['reactive'] = false;

    let options: BaselineSeriesPartialOptions;
    $: options = {
        lastValueVisible,
        title,
        priceScaleId,
        visible,
        priceLineVisible,
        priceLineSource,
        priceLineWidth,
        priceLineColor,
        priceLineStyle,
        priceFormat,
        baseLineVisible,
        baseLineColor,
        baseLineWidth,
        baseLineStyle,
        autoscaleInfoProvider,
        baseValue,
        topFillColor1,
        topFillColor2,
        topLineColor,
        bottomFillColor1,
        bottomFillColor2,
        bottomLineColor,
        lineStyle,
        lineWidth,
        crosshairMarkerBackgroundColor,
        crosshairMarkerBorderColor,
        crosshairMarkerRadius,
        crosshairMarkerVisible,
        lastPriceAnimation,
    };

    let reference: ISeriesApi<'Baseline'> | null = null;

    let handleReference: Reference<ISeriesApi<'Baseline'>> | undefined = undefined;
    $: handleReference = ((ref?: Reference<ISeriesApi<'Baseline'>>) => (series: ISeriesApi<'Baseline'> | null) => {
        reference = series;
        if (ref !== undefined) {
            ref(series);
        }
    })(ref);

    const id = performance.now().toString();
    useSeriesEffect(() => [
        {
            id,
            type: 'Baseline',
            reactive,
            options,
            data,
        },
        handleReference,
    ]);
</script>
{#if reference !== null}
    <ContextProvider value={reference}>
        <slot/>
    </ContextProvider>
{/if}
