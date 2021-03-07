<svelte:options immutable={true}/>

<script lang="ts">
    import type {
        BarSeriesPartialOptions,
        SeriesDataItemTypeMap,
        ISeriesApi,
    } from 'lightweight-charts';
    import type {Reference} from '../types';
    import {series} from '../series';
    import {context} from './utils';
    import {onDestroy} from 'svelte';

    /** Visibility of the label with the latest visible price on the price scale */
    export let lastValueVisible: BarSeriesPartialOptions['lastValueVisible'] | undefined = undefined;
    /** Title of the series. This label is placed with price axis label */
    export let title: BarSeriesPartialOptions['title'] | undefined = undefined;
    /** Target price scale to bind new series to */
    export let priceScaleId: BarSeriesPartialOptions['priceScaleId'] | undefined = undefined;
    /** Visibility of series. */
    export let visible: BarSeriesPartialOptions['visible'] | undefined = undefined;
    /** Visibility of the price line. Price line is a horizontal line indicating the last price of the series */
    export let priceLineVisible: BarSeriesPartialOptions['priceLineVisible'] | undefined = undefined;
    /** Enum of possible modes of priceLine source */
    export let priceLineSource: BarSeriesPartialOptions['priceLineSource'] | undefined = undefined;
    /** Width of the price line. Ignored if priceLineVisible is false */
    export let priceLineWidth: BarSeriesPartialOptions['priceLineWidth'] | undefined = undefined;
    /** Color of the price line. Ignored if priceLineVisible is false */
    export let priceLineColor: BarSeriesPartialOptions['priceLineColor'] | undefined = undefined;
    /** Price line style. Suitable for percentage and indexedTo100 scales */
    export let priceLineStyle: BarSeriesPartialOptions['priceLineStyle'] | undefined = undefined;
    /** Formatting settings associated with the series */
    export let priceFormat: BarSeriesPartialOptions['priceFormat'] | undefined = undefined;
    /** Visibility of base line. Suitable for percentage and indexedTo100 scales */
    export let baseLineVisible: BarSeriesPartialOptions['baseLineVisible'] | undefined = undefined;
    /** Color of the base line in IndexedTo100 mode */
    export let baseLineColor: BarSeriesPartialOptions['baseLineColor'] | undefined = undefined;
    /** Base line width. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineWidth: BarSeriesPartialOptions['baseLineWidth'] | undefined = undefined;
    /** Base line style. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineStyle: BarSeriesPartialOptions['baseLineStyle'] | undefined = undefined;
    /** function that overrides calculating of visible prices range */
    export let autoscaleInfoProvider: BarSeriesPartialOptions['autoscaleInfoProvider'] | undefined = undefined;
    export let scaleMargins: BarSeriesPartialOptions['scaleMargins'] | undefined = undefined;

    export let upColor: string | undefined = undefined;
    export let downColor: string | undefined = undefined;
    export let openVisible: boolean | undefined = undefined;
    export let thinBars: boolean | undefined = undefined;

    export let ref: Reference<ISeriesApi<'Bar'>> | undefined = undefined;

    export let data: SeriesDataItemTypeMap['Bar'][] = [];

    let options: BarSeriesPartialOptions;
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
        upColor,
        downColor,
        openVisible,
        thinBars,
    };

    const id = performance.now().toString();
    const subject = series(context(), {
        id,
        type: 'Bar',
        options,
        data,
        reference: ref,
    });

    $: subject.update({
        id,
        type: 'Bar',
        options,
        data,
        reference: ref,
    });

    onDestroy(() => {
        subject.destroy();
    });
</script>
