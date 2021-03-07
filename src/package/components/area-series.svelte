<svelte:options immutable={true}/>

<script lang="ts">
    import type {
        AreaSeriesPartialOptions,
        LineStyle,
        LineType,
        LineWidth,
        SeriesDataItemTypeMap,
        ISeriesApi,
    } from 'lightweight-charts';
    import type {Reference} from '../types';
    import {series} from '../series';
    import {context} from './utils';
    import {onDestroy} from 'svelte';

    /** Visibility of the label with the latest visible price on the price scale */
    export let lastValueVisible: AreaSeriesPartialOptions['lastValueVisible'] | undefined = undefined;
    /** Title of the series. This label is placed with price axis label */
    export let title: AreaSeriesPartialOptions['title'] | undefined = undefined;
    /** Target price scale to bind new series to */
    export let priceScaleId: AreaSeriesPartialOptions['priceScaleId'] | undefined = undefined;
    /** Visibility of series. */
    export let visible: AreaSeriesPartialOptions['visible'] | undefined = undefined;
    /** Visibility of the price line. Price line is a horizontal line indicating the last price of the series */
    export let priceLineVisible: AreaSeriesPartialOptions['priceLineVisible'] | undefined = undefined;
    /** Enum of possible modes of priceLine source */
    export let priceLineSource: AreaSeriesPartialOptions['priceLineSource'] | undefined = undefined;
    /** Width of the price line. Ignored if priceLineVisible is false */
    export let priceLineWidth: AreaSeriesPartialOptions['priceLineWidth'] | undefined = undefined;
    /** Color of the price line. Ignored if priceLineVisible is false */
    export let priceLineColor: AreaSeriesPartialOptions['priceLineColor'] | undefined = undefined;
    /** Price line style. Suitable for percentage and indexedTo100 scales */
    export let priceLineStyle: AreaSeriesPartialOptions['priceLineStyle'] | undefined = undefined;
    /** Formatting settings associated with the series */
    export let priceFormat: AreaSeriesPartialOptions['priceFormat'] | undefined = undefined;
    /** Visibility of base line. Suitable for percentage and indexedTo100 scales */
    export let baseLineVisible: AreaSeriesPartialOptions['baseLineVisible'] | undefined = undefined;
    /** Color of the base line in IndexedTo100 mode */
    export let baseLineColor: AreaSeriesPartialOptions['baseLineColor'] | undefined = undefined;
    /** Base line width. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineWidth: AreaSeriesPartialOptions['baseLineWidth'] | undefined = undefined;
    /** Base line style. Suitable for percentage and indexedTo100 scales. Ignored if baseLineVisible is not set */
    export let baseLineStyle: AreaSeriesPartialOptions['baseLineStyle'] | undefined = undefined;
    /** function that overrides calculating of visible prices range */
    export let autoscaleInfoProvider: AreaSeriesPartialOptions['autoscaleInfoProvider'] | undefined = undefined;
    export let scaleMargins: AreaSeriesPartialOptions['scaleMargins'] | undefined = undefined;

    export let topColor: string | undefined = undefined;
    export let bottomColor: string | undefined = undefined;
    export let lineColor: string | undefined = undefined;
    export let lineStyle: LineStyle | undefined = undefined;
    export let lineWidth: LineWidth | undefined = undefined;
    export let lineType: LineType | undefined = undefined;
    export let crosshairMarkerVisible: boolean | undefined = undefined;
    export let crosshairMarkerRadius: number | undefined = undefined;
    export let crosshairMarkerBorderColor: string | undefined = undefined;
    export let crosshairMarkerBackgroundColor: string | undefined = undefined;

    export let ref: Reference<ISeriesApi<'Area'>> | undefined = undefined;

    export let data: SeriesDataItemTypeMap['Area'][] = [];

    let options: AreaSeriesPartialOptions;
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
        topColor,
        bottomColor,
        lineColor,
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
        type: 'Area',
        options,
        data,
        reference: ref,
    });

    $: subject.update({
        id,
        type: 'Area',
        options,
        data,
        reference: ref,
    });

    onDestroy(() => {
        subject.destroy();
    });
</script>
