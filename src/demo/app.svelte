<svelte:options immutable={true}/>

<script lang="ts">
    import type {
        IChartApi,
        ISeriesApi,
        SeriesType,
        ChartOptions,
        DeepPartial,
    } from 'lightweight-charts';
    import type {
        Reference,
        ChartEventArgs,
        TimeScaleEventArgs,
    } from 'svelte-lightweight-charts';

    import type {PriceLineParams} from 'svelte-lightweight-charts/internal/lines';
    import type {SeriesActionParams, HistogramSeriesParams} from 'svelte-lightweight-charts/internal/series';

    import {LineStyle} from 'lightweight-charts';
    import {BAR_DATA, HISTOGRAM_DATA, LINE_DATA} from './data-series';
    import {onMount} from 'svelte';

    import {
        Chart,
        LineSeries,
        AreaSeries,
        HistogramSeries,
        BarSeries,
        CandlestickSeries,
        BaselineSeries,
        PriceLine,
        TimeScale,
        PriceScale,
    } from 'svelte-lightweight-charts';

    type EverySeriesApi =
        | ISeriesApi<'Area'>
        | ISeriesApi<'Bar'>
        | ISeriesApi<'Histogram'>
        | ISeriesApi<'Candlestick'>
        | ISeriesApi<'Line'>
        | ISeriesApi<'Baseline'>
        ;

    export let reference: Reference<IChartApi> | undefined = undefined;

    const SERIES_TYPES: SeriesType[] = ['Area', 'Bar', 'Histogram', 'Candlestick', 'Line', 'Baseline'];

    const lines: PriceLineParams[] = [{
        id: 'price',
        options: {
            price: 41.0,
            color: 'green',
            lineWidth: 2,
            lineStyle: LineStyle.Dotted,
            axisLabelVisible: true,
            title: 'P/L 500',
        },
    }];

    let width = 400;
    let height = 300;

    let options: DeepPartial<ChartOptions>;
    $: options = {
        width,
        height,
    };

    let seriesType: SeriesType = 'Area';

    let start: Date;
    let day: Date;
    let mainProps: SeriesActionParams;
    let volumeProps: HistogramSeriesParams;

    $: {
        mainProps = createMainSeriesProps(seriesType);
        volumeProps = createVolumeProps();
        start = day = new Date(2019, 5, 29);
    }

    let mainSeries: EverySeriesApi | null = null;
    let volume: ISeriesApi<'Histogram'> | null = null;

    let mainSeriesComponent: EverySeriesApi | null = null;
    let volumeComponent: ISeriesApi<'Histogram'> | null = null;

    $: if (start !== day) {
        updateSeriesData(mainSeries, day);
        updateVolumeData(volume, day);

        updateSeriesData(mainSeriesComponent, day);
        updateVolumeData(volumeComponent, day);
    }

    let showVolume = true;
    let intraday = false;
    let timeScaleVisible = true;
    let priceScaleId = 'right';
    let ticker: number | null = null;

    $: if (ticker !== null) {
        setupTicker(!intraday);
    }

    let api: IChartApi | null = null;
    let drawMode: 'draw-priceline' | null = null;

    onMount(() => {
        window.addEventListener('mousedown', handleClickStart, true);
        window.addEventListener('mouseup', handleClickEnd);
        return () => {
            window.removeEventListener('mousedown', handleClickStart, true);
            window.removeEventListener('mouseup', handleClickEnd);
        }
    })

    function handleClick(e: ChartEventArgs['click']): void {
        const {point} = e.detail;
        if (point === undefined) {
            return;
        }
        if (mainSeries === null) {
            return;
        }
        const price = mainSeries.coordinateToPrice(point.y);
        if (price === null) {
            return;
        }

        switch (drawMode) {
            case 'draw-priceline': {
                const line: PriceLineParams = {
                    id: 'limit',
                    options: {
                        price: price,
                        color: '#be1238',
                        lineWidth: 2,
                        lineStyle: LineStyle.Solid,
                        axisLabelVisible: true,
                        title: 'limit',
                    }
                };
                mainProps = shallowCopy(mainProps)
                mainProps.priceLines = [...lines, line];
                break;
            }
        }
    }

    function handleCrosshairMove(e: ChartEventArgs['crosshairMove']): void {
        // eslint-disable-next-line no-console
        console.log('move', e.detail);
    }

    function handleReference(ref: IChartApi | null): void {
        api = ref;
        reference?.(ref);
    }

    function handleFitContent(): void {
        api?.timeScale().fitContent();
    }

    function handleClickStart(e: MouseEvent): void {
        drawMode = e.ctrlKey ? 'draw-priceline' : null;
    }

    function handleClickEnd(): void {
        drawMode = null;
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
            ticker = window.setInterval(
                () => {
                    day.setDate(day.getDate() + 1);
                    day = new Date(day);
                },
                1000
            );
        } else {
            ticker = window.setInterval(
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
                    data: [...LINE_DATA],
                    priceLines: lines,
                    reference: (ref: ISeriesApi<'Area'> | null) => {
                        mainSeries = ref;
                    }
                }
            case 'Line':
                return {
                    id: 'main',
                    type,
                    data: [...LINE_DATA],
                    priceLines: lines,
                    reference: (ref: ISeriesApi<'Line'> | null) => {
                        mainSeries = ref;
                    }
                }
            case 'Bar':
                return {
                    id: 'main',
                    type,
                    data: [...BAR_DATA],
                    priceLines: lines,
                    reference: (ref: ISeriesApi<'Bar'> | null) => {
                        mainSeries = ref;
                    },
                }
            case 'Candlestick':
                return {
                    id: 'main',
                    type,
                    data: [...BAR_DATA],
                    priceLines: lines,
                    reference: (ref: ISeriesApi<'Candlestick'> | null) => {
                        mainSeries = ref;
                    },
                }
            case 'Histogram':
                return {
                    id: 'main',
                    type,
                    data: [...HISTOGRAM_DATA],
                    priceLines: lines,
                    reference: (ref: ISeriesApi<'Histogram'> | null) => {
                        mainSeries = ref;
                    },
                }
            case 'Baseline':
                return {
                    id: 'main',
                    type,
                    data: [...LINE_DATA],
                    options: {
                        baseValue: {
                            type: "price",
                            price: 38,
                        },
                    },
                    priceLines: lines,
                    reference: (ref: ISeriesApi<'Baseline'> | null) => {
                        mainSeries = ref;
                    }
                }
            default:
                throw new Error();
        }
    }

    function createVolumeProps(): HistogramSeriesParams {
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
            data: [...HISTOGRAM_DATA],
            reference: (ref: ISeriesApi<'Histogram'> | null) => volume = ref,
        }
    }

    function updateSeriesData(api: EverySeriesApi | null, date: Date): void {
        if (api === null) {
            return
        }
        if (containsLineData(api)) {
            api.update({time: date.toISOString().slice(0, 10), value: 90 - 20 * Math.random()})
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
            api.update({time: date.toISOString().slice(0, 10), value: 90 - 20 * Math.random()})
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
        api?.update({time: date.toISOString().slice(0, 10), value: (20097125.00 - Math.random() * 10000000)});
    }

    function shallowCopy<T extends object>(value: T): T {
        return {...value};
    }

    function handleMainComponentReference(ref: EverySeriesApi | null): void {
        mainSeriesComponent = ref;
    }

    function handleVolumeComponentReference(ref: ISeriesApi<'Histogram'> | null): void {
        volumeComponent = ref;
    }

    let timeScaleInfo: Record<string, unknown> = {};
    function handleTimeScaleEvent<T extends keyof TimeScaleEventArgs>(event: TimeScaleEventArgs[T]): void {
        timeScaleInfo[event.type] = event.detail;
        timeScaleInfo = { ...timeScaleInfo };
    }
</script>

<form>
    <fieldset name="navigation">
        <legend>Navigation:</legend>
        <a href="official-samples.html">Official samples gallery</a>
    </fieldset>
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
        {#each SERIES_TYPES as type (type)}
            <label>
                <input type="radio" name="series-type" value={type} bind:group={seriesType}> {type}
            </label>
        {/each}
    </fieldset>
    <fieldset name="controller">
        <legend>Controller options:</legend>
        <label>
            <input type="checkbox" name="show-volume" id="show-volume" bind:checked={showVolume}> Show Volume
        </label>
        <label>
            <input type="checkbox" name="intraday" id="intraday" bind:checked={intraday}> Intraday
        </label>
        <label>
            <input type="checkbox" name="time-scale" id="time-scale" bind:checked={timeScaleVisible}> Visible Time Scale
        </label>
        <label>
            <input type="radio" name="price-scale" id="price-scale-right" value="right" bind:group={priceScaleId}> Right Price Scale
        </label>
        <label>
            <input type="radio" name="price-scale" id="price-scale-left" value="left" bind:group={priceScaleId}> Left Price Scale
        </label>
        <button on:click={handleTicker} type="button">{ ticker ? 'Stop' : 'Start' }</button>
        <button on:click={handleFitContent} type="button">Fit content</button>
    </fieldset>
    <fieldset name="chart-component">
        <legend>Chart component:</legend>
        <Chart
            {...options}
            ref={handleReference}
            container={{
                class: 'chart',
                // eslint-disable-next-line no-console
                ref: console.log
            }}
            on:crosshairMove={handleCrosshairMove}
            on:click={handleClick}
        >
            <PriceScale
                id="left"
                visible={priceScaleId === 'left'}
            />
            <PriceScale
                id="right"
                visible={priceScaleId === 'right'}
            />
            <TimeScale
                visible={timeScaleVisible}
                on:visibleTimeRangeChange={handleTimeScaleEvent}
                on:visibleLogicalRangeChange={handleTimeScaleEvent}
                on:sizeChange={handleTimeScaleEvent}
            />
            {#if mainProps.type === 'Area' }
                <AreaSeries
                    {...(mainProps.options ?? {})}
                    priceScaleId={priceScaleId}
                    data={mainProps.data}
                    ref={handleMainComponentReference}
                >
                    {#each lines as line (line.id)}
                        <PriceLine {...line.options}/>
                    {/each}
                </AreaSeries>
            {/if}
            {#if mainProps.type === 'Line' }
                <LineSeries
                    {...(mainProps.options ?? {})}
                    priceScaleId={priceScaleId}
                    data={mainProps.data}
                    ref={handleMainComponentReference}
                >
                    {#each lines as line (line.id)}
                        <PriceLine {...line.options}/>
                    {/each}
                </LineSeries>
            {/if}
            {#if mainProps.type === 'Histogram'}
                <HistogramSeries
                    {...(mainProps.options ?? {})}
                    priceScaleId={priceScaleId}
                    data={mainProps.data}
                    ref={handleMainComponentReference}
                >
                    {#each lines as line (line.id)}
                        <PriceLine {...line.options}/>
                    {/each}
                </HistogramSeries>
            {/if}
            {#if mainProps.type === 'Bar'}
                <BarSeries
                    {...(mainProps.options ?? {})}
                    priceScaleId={priceScaleId}
                    data={mainProps.data}
                    ref={handleMainComponentReference}
                >
                    {#each lines as line (line.id)}
                        <PriceLine {...line.options}/>
                    {/each}
                </BarSeries>
            {/if}
            {#if mainProps.type === 'Candlestick'}
                <CandlestickSeries
                    {...(mainProps.options ?? {})}
                    priceScaleId={priceScaleId}
                    data={mainProps.data}
                    ref={handleMainComponentReference}
                >
                    {#each lines as line (line.id)}
                        <PriceLine {...line.options}/>
                    {/each}
                </CandlestickSeries>
            {/if}
            {#if mainProps.type === 'Baseline'}
                <BaselineSeries
                    {...(mainProps.options ?? {})}
                    priceScaleId={priceScaleId}
                    data={mainProps.data}
                    ref={handleMainComponentReference}
                >
                    {#each lines as line (line.id)}
                        <PriceLine {...line.options}/>
                    {/each}
                </BaselineSeries>
            {/if}
            {#if showVolume}
                {#key volumeProps.id}
                    <HistogramSeries
                        {...(volumeProps.options ?? {})}
                        data={volumeProps.data}
                        ref={handleVolumeComponentReference}
                    />
                {/key}
            {/if}
        </Chart>
    </fieldset>
    <fieldset>
        <legend>TimeScale info:</legend>
        <pre>{JSON.stringify(timeScaleInfo, null, 4)}</pre>
    </fieldset>
</form>


<style>

</style>
