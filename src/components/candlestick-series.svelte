<svelte:options immutable={true}/>

<script lang="ts">
    import type {
        CandlestickSeriesPartialOptions,
        SeriesDataItemTypeMap
    } from 'lightweight-charts';
    import {series} from '../series';
    import {context} from './utils';
    import {onDestroy} from 'svelte';

    /** Visibility of the label with the latest visible price on the price scale */
    export let lastValueVisible: CandlestickSeriesPartialOptions['lastValueVisible'] | undefined = undefined;
    /** Title of the series. This label is placed with price axis label */
    export let title: CandlestickSeriesPartialOptions['title'] | undefined = undefined;
    /** Target price scale to bind new series to */
    export let priceScaleId: CandlestickSeriesPartialOptions['priceScaleId'] | undefined = undefined;
    /** Visibility of series. */
    export let visible: CandlestickSeriesPartialOptions['visible'] | undefined = undefined;
    /** Visibility of the price line. Price line is a horizontal line indicating the last price of the series */
    export let priceLineVisible: CandlestickSeriesPartialOptions['priceLineVisible'] | undefined = undefined;
    /** Enum of possible modes of priceLine source */
    export let priceLineSource: CandlestickSeriesPartialOptions['priceLineSource'] | undefined = undefined;
    /** Width of the price line. Ignored if priceLineVisible is false */
    export let priceLineWidth: CandlestickSeriesPartialOptions['priceLineWidth'] | undefined = undefined;
    /** Color of the price line. Ignored if priceLineVisible is false */
    export let priceLineColor: CandlestickSeriesPartialOptions['priceLineColor'] | undefined = undefined;
    /** Price line style. Suitable for percentage and indexedTo100 scales */
    export let priceLineStyle: CandlestickSeriesPartialOptions['priceLineStyle'] | undefined = undefined;
    /** Formatting settings associated with the series */
    export let priceFormat: CandlestickSeriesPartialOptions['priceFormat'] | undefined = undefined;
    /** Visibility of base line. Suitable for percentage and indexedTo100 scales */
    export let baseLineVisible: CandlestickSeriesPartialOptions['baseLineVisible'] | undefined = undefined;
    /** Color of the base line in IndexedTo100 mode */
    export let baseLineColor: CandlestickSeriesPartialOptions['baseLineColor'] | undefined = undefined;
    /** Base line width. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineWidth: CandlestickSeriesPartialOptions['baseLineWidth'] | undefined = undefined;
    /** Base line style. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineStyle: CandlestickSeriesPartialOptions['baseLineStyle'] | undefined = undefined;
    /** function that overrides calculating of visible prices range */
    export let autoscaleInfoProvider: CandlestickSeriesPartialOptions['autoscaleInfoProvider'] | undefined = undefined;
    export let scaleMargins: CandlestickSeriesPartialOptions['scaleMargins'] | undefined = undefined;

    /** Color of rising candlesticks */
    export let upColor: string | undefined = undefined;
    /** Color of falling candlesticks */
    export let downColor: string | undefined = undefined;
    /** Flag to draw/hide candlestick wicks */
    export let wickVisible: boolean | undefined = undefined;
    /** Flag to draw/hide candlestick borders around bodies */
    export let borderVisible: boolean | undefined = undefined;
    /**
     * Color of borders around candles' bodies. Ignored if borderVisible == false
     * If specified, it overrides both borderUpColor and borderDownColor options
     */
    export let borderColor: string | undefined = undefined;
    /** Color of the border of rising candlesticks. Ignored if borderVisible == false or borderColor is specified */
    export let borderUpColor: string | undefined = undefined;
    /** Color of the border of rising candlesticks. Ignored if borderVisible == false or borderColor is specified */
    export let borderDownColor: string | undefined = undefined;
    /**
     * Color of candlestick wicks. Ignored if wickVisible == false
     * If specified, it overrides both wickUpColor and wickDownColor options
     */
    export let wickColor: string | undefined = undefined;
    /** Color of rising candlestick wicks. Ignored if wickVisible == false or wickColor is specified */
    export let wickUpColor: string | undefined = undefined;
    /** Color of falling candlestick wicks. Ignored if wickVisible == false or wickColor is specified */
    export let wickDownColor: string | undefined = undefined;

    export let data: SeriesDataItemTypeMap['Candlestick'][] = [];

    let options: CandlestickSeriesPartialOptions;
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
        wickColor,
        borderColor,
        borderUpColor,
        borderDownColor,
        wickVisible,
        borderVisible,
        wickUpColor,
        wickDownColor,
    };

    const id = performance.now().toString();
    const subject = series(context(), {
        id,
        type: 'Candlestick',
        options,
        data,
    });

    $: subject.update({
        id,
        type: 'Candlestick',
        options,
        data,
    });

    onDestroy(() => {
        subject.destroy();
    });
</script>
