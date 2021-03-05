<svelte:options immutable={true}/>

<script lang="ts">
    import type {
        LineSeriesPartialOptions,
        LineStyle,
        LineType,
        LineWidth,
        SeriesDataItemTypeMap
    } from 'lightweight-charts';
    import {series} from '../series';
    import {context} from './utils';
    import {onDestroy} from 'svelte';

    /** Visibility of the label with the latest visible price on the price scale */
    export let lastValueVisible: LineSeriesPartialOptions['lastValueVisible'] | undefined = undefined;
    /** Title of the series. This label is placed with price axis label */
    export let title: LineSeriesPartialOptions['title'] | undefined = undefined;
    /** Target price scale to bind new series to */
    export let priceScaleId: LineSeriesPartialOptions['priceScaleId'] | undefined = undefined;
    /** Visibility of series. */
    export let visible: LineSeriesPartialOptions['visible'] | undefined = undefined;
    /** Visibility of the price line. Price line is a horizontal line indicating the last price of the series */
    export let priceLineVisible: LineSeriesPartialOptions['priceLineVisible'] | undefined = undefined;
    /** Enum of possible modes of priceLine source */
    export let priceLineSource: LineSeriesPartialOptions['priceLineSource'] | undefined = undefined;
    /** Width of the price line. Ignored if priceLineVisible is false */
    export let priceLineWidth: LineSeriesPartialOptions['priceLineWidth'] | undefined = undefined;
    /** Color of the price line. Ignored if priceLineVisible is false */
    export let priceLineColor: LineSeriesPartialOptions['priceLineColor'] | undefined = undefined;
    /** Price line style. Suitable for percentage and indexedTo100 scales */
    export let priceLineStyle: LineSeriesPartialOptions['priceLineStyle'] | undefined = undefined;
    /** Formatting settings associated with the series */
    export let priceFormat: LineSeriesPartialOptions['priceFormat'] | undefined = undefined;
    /** Visibility of base line. Suitable for percentage and indexedTo100 scales */
    export let baseLineVisible: LineSeriesPartialOptions['baseLineVisible'] | undefined = undefined;
    /** Color of the base line in IndexedTo100 mode */
    export let baseLineColor: LineSeriesPartialOptions['baseLineColor'] | undefined = undefined;
    /** Base line width. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineWidth: LineSeriesPartialOptions['baseLineWidth'] | undefined = undefined;
    /** Base line style. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineStyle: LineSeriesPartialOptions['baseLineStyle'] | undefined = undefined;
    /** function that overrides calculating of visible prices range */
    export let autoscaleInfoProvider: LineSeriesPartialOptions['autoscaleInfoProvider'] | undefined = undefined;

    export let color: string | undefined = undefined;
    export let lineStyle: LineStyle | undefined = undefined;
    export let lineWidth: LineWidth | undefined = undefined;
    export let lineType: LineType | undefined = undefined;
    export let crosshairMarkerVisible: boolean | undefined = undefined;
    export let crosshairMarkerRadius: number | undefined = undefined;
    export let crosshairMarkerBorderColor: string | undefined = undefined;
    export let crosshairMarkerBackgroundColor: string | undefined = undefined;

    export let data: SeriesDataItemTypeMap['Line'][] = [];

    let options: LineSeriesPartialOptions;
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
        color,
        lineStyle,
        lineWidth,
        lineType,
        crosshairMarkerBackgroundColor,
        crosshairMarkerBorderColor,
        crosshairMarkerRadius,
        crosshairMarkerVisible,
    };

    const id = performance.now().toString();
    const subject = series(context(), {
        id,
        type: 'Line',
        options,
        data,
    });

    $: subject.update({
        id,
        type: 'Line',
        options,
        data,
    });

    onDestroy(() => {
        subject.destroy();
    });
</script>
