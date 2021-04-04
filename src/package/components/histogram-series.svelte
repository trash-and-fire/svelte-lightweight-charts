<svelte:options immutable={true}/>

<script lang="ts">
    import type {HistogramSeriesPartialOptions} from 'lightweight-charts';
    import type {$$PROPS} from './histogram-series.interface';
    import {series} from '../series';
    import {context} from './utils';
    import {afterUpdate, onDestroy} from 'svelte';

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
    export let scaleMargins: $$PROPS['scaleMargins'] = undefined;

    export let color: $$PROPS['color'] = undefined;
    export let base: $$PROPS['base'] = undefined;

    export let ref: $$PROPS['ref'] = undefined;

    export let data: $$PROPS['data'] = [];

    let options: HistogramSeriesPartialOptions;
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
        scaleMargins,
        color,
        base,
    };

    const id = performance.now().toString();
    const subject = series(context(), {
        id,
        type: 'Histogram',
        options,
        data,
    });

    $: subject.update({
        id,
        type: 'Histogram',
        options,
        data,
    });

    afterUpdate(() => {
        subject.updateReference(ref);
    });

    onDestroy(() => {
        subject.destroy();
    });
</script>
