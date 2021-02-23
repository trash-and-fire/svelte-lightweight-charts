<svelte:options immutable={true}/>

<script lang="ts">
    import type {ISeriesApi, SeriesType} from 'lightweight-charts';
    import type {SeriesActionParams} from './types';
    import {chart} from '.';
    import {BAR_DATA, HISTOGRAM_DATA, LINE_DATA} from './data-series';

    type EverySeriesApi =
        | ISeriesApi<'Area'>
        | ISeriesApi<'Bar'>
        | ISeriesApi<'Histogram'>
        | ISeriesApi<'Candlestick'>
        | ISeriesApi<'Line'>
    ;

    const SERIES_TYPES: SeriesType[] = ['Area', 'Bar', 'Histogram', 'Candlestick', 'Line'];

    let width = 400;
    let height = 300;

    $: options = {
        width,
        height,
    };

    let seriesType: SeriesType = 'Area';

    let start: Date;
    let day: Date;
    let mainProps: SeriesActionParams;
    let volumeProps: SeriesActionParams;

    $: {
        mainProps = createMainSeriesProps(seriesType);
        volumeProps = createVolumeProps();
        start = day = new Date(2019, 5, 29);
    }

    let mainSeries: EverySeriesApi | null = null;
    let volume: ISeriesApi<'Histogram'> | null = null;

    $: if (start !== day) {
        updateSeriesData(mainSeries, day);
        updateVolumeData(volume, day);
    }

    let intraday = false;
    let ticker: number | null = null;

    $: if (ticker !== null) {
        setupTicker(!intraday);
    }

    function handleReference<T>(ref: T | null): void {
        // eslint-disable-next-line no-console
        console.log(ref);
    }

    function handleTicker(): void {
        if (ticker !== null) {
            clearTicker();
        } else {
            setupTicker(!intraday);
        }
    }

    function clearTicker(): void {
        if (ticker !== null) {
            clearInterval(ticker);
            ticker = null;
        }
    }

    function setupTicker(daily: boolean = true): void {
        if (ticker !== null) {
            clearTicker();
        }
        if (daily) {
            ticker = setInterval(
                () => {
                    day.setDate(day.getDate() + 1);
                    day = new Date(day);
                },
                1000
            );
        } else {
            ticker = setInterval(
                () => {
                    day.setHours(day.getHours() + 6);
                    day = new Date(day);
                },
                250
            );
        }
    }

    function createMainSeriesProps(type: SeriesType): SeriesActionParams {
        switch (type) {
            case 'Area':
                return {
                    id: 'main',
                    type,
                    data: LINE_DATA,
                    reference: (ref: ISeriesApi<'Area'> | null) => {
                        mainSeries = ref;
                    }
                }
            case 'Line':
                return {
                    id: 'main',
                    type,
                    data: LINE_DATA,
                    reference: (ref: ISeriesApi<'Line'> | null) => {
                        mainSeries = ref;
                    }
                }
            case 'Bar':
                return {
                    id: 'main',
                    type,
                    data: BAR_DATA,
                    reference: (ref: ISeriesApi<'Bar'> | null) => {
                        mainSeries = ref;
                    },
                }
            case 'Candlestick':
                return {
                    id: 'main',
                    type,
                    data: BAR_DATA,
                    reference: (ref: ISeriesApi<'Candlestick'> | null) => {
                        mainSeries = ref;
                    },
                }
            case 'Histogram':
                return {
                    id: 'main',
                    type,
                    data: HISTOGRAM_DATA,
                    reference: (ref: ISeriesApi<'Histogram'> | null) => {
                        mainSeries = ref;
                    },
                }
            default: throw new Error();
        }
    }

    function createVolumeProps(): SeriesActionParams {
        return {
            id: 'volume-' + performance.now(),
            type: 'Histogram',
            options: {
                color: '#26a69a',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '',
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            },
            data: HISTOGRAM_DATA,
            reference: (ref: ISeriesApi<'Histogram'> | null) => volume = ref,
        }
    }

    function updateSeriesData(api: EverySeriesApi | null, date: Date): void {
        if (api === null) {
            return
        }
        if (containsLineData(api)) {
            api.update({ time: date.toISOString().slice(0, 10), value: 90 - 20 * Math.random() })
        }
        if (containsBarData(api)) {
            api.update({
                time: date.toISOString().slice(0, 10),
                open: 194.38 - 20 * Math.random(),
                high: 196.47 - 20 * Math.random(),
                low: 193.75 - 20 * Math.random(),
                close: 194.08 - 20 * Math.random()
            });
        }
        if (containsHistogramData(api)) {
            api.update({ time: date.toISOString().slice(0, 10), value: 90 - 20 * Math.random() })
        }
    }

    function containsLineData(api: EverySeriesApi): api is ISeriesApi<'Line'> | ISeriesApi<'Area'> {
        return api.seriesType() === 'Line' || api.seriesType() === 'Area';
    }

    function containsBarData(api: EverySeriesApi): api is ISeriesApi<'Bar'> | ISeriesApi<'Candlestick'> {
        return api.seriesType() === 'Bar' || api.seriesType() === 'Candlestick';
    }

    function containsHistogramData(api: EverySeriesApi): api is ISeriesApi<'Histogram'> {
        return api.seriesType() === 'Histogram';
    }

    function updateVolumeData(api: ISeriesApi<'Histogram'> | null, date: Date): void {
        api?.update({ time: date.toISOString().slice(0, 10), value: (20097125.00 - Math.random() * 10000000) });
    }
</script>

<form>
    <fieldset name="size">
        <legend>Size options:</legend>
        <label>
            Width:
            <input type="range" bind:value={width} name="width" id="width" min="100" max="1000" step="50">
            {width}
        </label>
        <label>
            Height:
            <input type="range" bind:value={height} name="height" id="height" min="100" max="1000" step="50">
            {height}
        </label>
    </fieldset>
    <fieldset name="series">
        <legend>Main Series type:</legend>
        {#each SERIES_TYPES as type (type) }
            <label>
                <input type="radio" name="series-type" value={type} bind:group={seriesType}> {type}
            </label>
        {/each}
    </fieldset>
    <fieldset name="controller">
        <legend>Controller options:</legend>
        <label>
            <input type="checkbox" name="intraday" id="intraday" bind:checked={intraday}> Intraday
        </label>
        <button on:click={handleTicker} type="button">{ ticker ? 'Stop' : 'Start' }</button>
    </fieldset>
    <fieldset name="chart">
        <legend>Chart:</legend>
        <section use:chart={{ options, series: [mainProps, volumeProps], reference: handleReference }}></section>
    </fieldset>
</form>


<style>

</style>
