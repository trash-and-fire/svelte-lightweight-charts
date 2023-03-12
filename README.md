# svelte-lightweight-charts

This package is a Svelte wrapper for [lightweight-charts](https://github.com/tradingview/lightweight-charts)

## [Demo](https://trash-and-fire.github.io/svelte-lightweight-charts/official-samples.html)

Here are some official examples rewritten on Svelte. Each example you can open in the REPL to modify or fork

If you need more information you can see [demo app sources](./src/demo) or [example sources](./src/demo/samples)

## Installing

```bash
npm install lightweight-charts svelte-lightweight-charts
```

## Usage

```svelte
<script>
    import { Chart, LineSeries } from "svelte-lightweight-charts";
    const data = [
        { time: '2019-04-11', value: 80.01 },
        { time: '2019-04-12', value: 96.63 },
        { time: '2019-04-13', value: 76.64 },
        { time: '2019-04-14', value: 81.89 },
        { time: '2019-04-15', value: 74.43 },
        { time: '2019-04-16', value: 80.01 },
        { time: '2019-04-17', value: 96.63 },
        { time: '2019-04-18', value: 76.64 },
        { time: '2019-04-19', value: 81.89 },
        { time: '2019-04-20', value: 74.43 },
    ];
</script>
<Chart width={800} height={600}>
    <LineSeries data={data}/>
</Chart>
```

## Getting reference to lightweight-chart objects

You can use the `ref` property to get a reference to a lightweight-chart api-instance from any component.
```svelte
<script>
    let chartApi;
</script>
<Chart width={400} height={300} ref={(ref) => chartApi = ref}/>
<button on:click={() => chartApi.timeScale().fitContent()}>Fit Content</button>
```
The value of `ref` property must be a function: `(api: T | null) => void`.

It is guaranteed that ref-callback will be called with some value when the component is mounted and with null value when the component is unmounted.
If you change the ref-callback, then the previous callback will be called with a null value, and the next callback will be called with the actual value.

## Components

### Chart

`<Chart>` - main chart container and wrapping dom element.
You can pass any option from [`ChartOptions`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ChartOptions) as separate property.

Using `container` property you can get access to containing element:
```ts
container?: {
    ref?: (element: HTMLElement | null) => void;
    class?: string;
    id?: string;
    style?: string;
}
```
If you need a reference to the containing dom element you can use `ref` property. It might be useful to setup IntersectionObserver on this dom element.

Use `class` or `style` properties with `<Chart autoSize={true}/>` to set up an adaptive chart: 
```svelte
<Chart
    autoSize={true}
    container={{class: 'chart-container'}}
>
    <LineSeries data={data}/>
</Chart>
<style>
:global(.chart-container) {
    aspect-ratio: 16 / 9;
    width: 80%;
    margin: auto;
}
</style>
```

#### SSR
The chart component will reserve the specified `width` and `height` during SSR if the chart is not auto-sized. 

Events:
- [`on:crosshairMove`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/IChartApi#subscribeclick): `(event: CustomEvent<MouseEventParams>) => void`
- [`on:click`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/IChartApi#subscribecrosshairmove): `(event: CustomEvent<MouseEventParams>) => void`

Use the `ref` property to get a reference to a [`IChartApi`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/IChartApi) instance

### Series

Following types of series are supported:
- `<AreaSeries>`
- `<BarSeries>`
- `<BaselineSeries>`
- `<CandlestickSeries>`
- `<HistogramSeries>`
- `<LineSeries>`

Series components should be nested inside a chart component. 

You can pass any series option as separate property. 
List of available options corresponding to each type of series can be found [here](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/SeriesOptionsMap)

Use the `ref` property to get reference to a [`ISeriesApi<SeriesType>`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ISeriesApi) instance.

#### Passing data
To pass a data to a series you can use the `data` property. Look [here](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/SeriesDataItemTypeMap) to find what shape of data you need for each series type.

By default `data` represents only the **initial** data. Any subsequent data update does not update series.
If you want to change this behavior please add [`reactive={true}`](https://svelte.dev/repl/0efb2840a9844ed5a1d84f2a1c9a2269) to your series component. In this case series will apply a new data if it is not reference equal to previous array.

#### Passing markers
To pass markers to a series you can use the `markers` property. Markers should be an array of `SeriesMarker<Time>`.

### Price line

To draw price line add `<PriceLine>` component inside any series.
```svelte
    <Chart width={600} height={300}>
        <LineSeries data={data}>
            <PriceLine
                title="minimum price"
                price={minimumPrice}
            />
            <PriceLine
                title="average price"
                price={avgPrice}
            />
            <PriceLine
                title="maximum price"
                price={maximumPrice}
            />
        </LineSeries>
    </Chart>
```

You can pass any options from [`PriceLineOptions`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/PriceLineOptions) as separate property. The `price` property is mandatory in dev mode.

Use the `ref` property to get reference to a [`IPriceLine`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/IPriceLine) instance.

#### Line drawing on click

You can draw price lines dynamically. For [example](https://svelte.dev/repl/3294790e6b5048a5abfb3d239405214b), you can draw a price line at a user-specified point.

### Time scale

`<TimeScale>` - the component is a binding to the current time scale of the current chart.
This component has to be nested inside a chart component and should not have duplicates. Each chart has only one time scale.

You can pass any option from [`TimeScaleOptions`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/TimeScaleOptions) as separate property.

Events:
- [`on:visibleTimeRangeChange`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ITimeScaleApi#subscribevisibletimerangechange) - `(event: CustomEvent<TimeRange | null>) => void`
- [`on:visibleLogicalRangeChange`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ITimeScaleApi#subscribevisiblelogicalrangechange) - `(event: CustomEvent<LogicalRange | null>) => void`
- [`on:sizeChange`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ITimeScaleApi#subscribesizechange) - `(event: CustomEvent<{ width: number; height: number }>) => void`

Use the `ref` property to get reference to a [`ITimeScaleApi`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ITimeScaleApi) instance.

Note: don't use `ChartOptions['timeScale']` and `<TimeScale>` component at the same time. This can lead to uncontrolled overwriting of options.

### Price scale

`<PriceScale>` - the component is a bindings to a certain price scale.
This component has to be nested inside chart component and requires an `id` property. Two price scales with the same `id` within the same chart result in undefined behaviour. 

You can pass any option from [`PriceScaleOptions`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/PriceScaleOptions) as separate property.

Note: don't use `ChartOptions['leftPriceScale']'` or `ChartOptions['rightPriceScale']` or `ChartOptions['overlayPriceScale']` and `<PriceScale>` at the same time. This can lead to uncontrolled overwriting of options.

## Typescript
Package is written on TypeScript and transpiled to plain `*.js` and `*.svelte` files. Definition files (including `*.svelte.d.ts`) are provided with package. It is a good place to find list of available properties that can be passed to each component.

## Related projects

Need a wrapper for another framework? Check out my [lightweight-charts-react-wrapper](https://github.com/trash-and-fire/lightweight-charts-react-wrapper)

## Licence

MIT

Review the license [requirements](https://github.com/tradingview/lightweight-charts#license) for the required "attribution notice" in the Lightweight Chart Repository.
