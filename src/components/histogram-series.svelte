<svelte:options immutable={true}/>

<script lang="ts">
    import type {
        HistogramSeriesPartialOptions,
        SeriesDataItemTypeMap
    } from 'lightweight-charts';
    import {series} from '../series';
    import {context} from './utils';
    import {onDestroy} from 'svelte';

    /** Visibility of the label with the latest visible price on the price scale */
    export let lastValueVisible: HistogramSeriesPartialOptions['lastValueVisible'] | undefined = undefined;
    /** Title of the series. This label is placed with price axis label */
    export let title: HistogramSeriesPartialOptions['title'] | undefined = undefined;
    /** Target price scale to bind new series to */
    export let priceScaleId: HistogramSeriesPartialOptions['priceScaleId'] | undefined = undefined;
    /** Visibility of series. */
    export let visible: HistogramSeriesPartialOptions['visible'] | undefined = undefined;
    /** Visibility of the price line. Price line is a horizontal line indicating the last price of the series */
    export let priceLineVisible: HistogramSeriesPartialOptions['priceLineVisible'] | undefined = undefined;
    /** Enum of possible modes of priceLine source */
    export let priceLineSource: HistogramSeriesPartialOptions['priceLineSource'] | undefined = undefined;
    /** Width of the price line. Ignored if priceLineVisible is false */
    export let priceLineWidth: HistogramSeriesPartialOptions['priceLineWidth'] | undefined = undefined;
    /** Color of the price line. Ignored if priceLineVisible is false */
    export let priceLineColor: HistogramSeriesPartialOptions['priceLineColor'] | undefined = undefined;
    /** Price line style. Suitable for percentage and indexedTo100 scales */
    export let priceLineStyle: HistogramSeriesPartialOptions['priceLineStyle'] | undefined = undefined;
    /** Formatting settings associated with the series */
    export let priceFormat: HistogramSeriesPartialOptions['priceFormat'] | undefined = undefined;
    /** Visibility of base line. Suitable for percentage and indexedTo100 scales */
    export let baseLineVisible: HistogramSeriesPartialOptions['baseLineVisible'] | undefined = undefined;
    /** Color of the base line in IndexedTo100 mode */
    export let baseLineColor: HistogramSeriesPartialOptions['baseLineColor'] | undefined = undefined;
    /** Base line width. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineWidth: HistogramSeriesPartialOptions['baseLineWidth'] | undefined = undefined;
    /** Base line style. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineStyle: HistogramSeriesPartialOptions['baseLineStyle'] | undefined = undefined;
    /** function that overrides calculating of visible prices range */
    export let autoscaleInfoProvider: HistogramSeriesPartialOptions['autoscaleInfoProvider'] | undefined = undefined;
    export let scaleMargins: HistogramSeriesPartialOptions['scaleMargins'] | undefined = undefined;

    export let color: string | undefined = undefined;
    export let base: number | undefined = undefined;

    export let data: SeriesDataItemTypeMap['Histogram'][] = [];

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

    onDestroy(() => {
        subject.destroy();
    });
</script>
