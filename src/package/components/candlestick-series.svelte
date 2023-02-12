<svelte:options immutable={true}/>

<script lang="ts">
    import type {CandlestickSeriesPartialOptions, ISeriesApi} from 'lightweight-charts';
    import type {$$PROPS} from './candlestick-series.interface.js';
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

    /** Color of rising candlesticks */
    export let upColor: $$PROPS['upColor'] = undefined;
    /** Color of falling candlesticks */
    export let downColor: $$PROPS['downColor'] = undefined;
    /** Flag to draw/hide candlestick wicks */
    export let wickVisible: $$PROPS['wickVisible'] = undefined;
    /** Flag to draw/hide candlestick borders around bodies */
    export let borderVisible: $$PROPS['borderVisible'] = undefined;
    /**
     * Color of borders around candles' bodies. Ignored if borderVisible == false
     * If specified, it overrides both borderUpColor and borderDownColor options
     */
    export let borderColor: $$PROPS['borderColor'] = undefined;
    /** Color of the border of rising candlesticks. Ignored if borderVisible == false or borderColor is specified */
    export let borderUpColor: $$PROPS['borderUpColor'] = undefined;
    /** Color of the border of rising candlesticks. Ignored if borderVisible == false or borderColor is specified */
    export let borderDownColor: $$PROPS['borderDownColor'] = undefined;
    /**
     * Color of candlestick wicks. Ignored if wickVisible == false
     * If specified, it overrides both wickUpColor and wickDownColor options
     */
    export let wickColor: $$PROPS['wickColor'] = undefined;
    /** Color of rising candlestick wicks. Ignored if wickVisible == false or wickColor is specified */
    export let wickUpColor: $$PROPS['wickUpColor'] = undefined;
    /** Color of falling candlestick wicks. Ignored if wickVisible == false or wickColor is specified */
    export let wickDownColor: $$PROPS['wickDownColor'] = undefined;

    export let ref: $$PROPS['ref'] = undefined;

    export let data: $$PROPS['data'] = [];
    export let reactive: $$PROPS['reactive'] = false;

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

    let reference: ISeriesApi<'Candlestick'> | null = null;

    let handleReference: Reference<ISeriesApi<'Candlestick'>> | undefined = undefined;
    $: handleReference = ((ref?: Reference<ISeriesApi<'Candlestick'>>) => (series: ISeriesApi<'Candlestick'> | null) => {
        reference = series;
        if (ref !== undefined) {
            ref(series);
        }
    })(ref);

    const id = performance.now().toString();
    useSeriesEffect(() => [
        {
            id,
            type: 'Candlestick',
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
