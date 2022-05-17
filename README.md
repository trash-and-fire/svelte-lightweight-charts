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
}
```
It might be helpful to [auto-size](https://svelte.dev/repl/22c14c4729d44d65a69346d1e3cc6e89) your chart container via ResizeObserver. 
```svelte
<Chart {width} {height} container={{ref}}>
    <CandlestickSeries {data}/>
</Chart>
<script>
    let observer;
    let width = 600;
    let height = 300;
    let ref = (element) => {
        if (observer) {
            observer.disconnect();
        }
        if (!element) {
                return;
        }
        observer = new ResizeObserver(([entry]) => {
            width = entry.contentRect.width;
            height = entry.contentRect.height;
        });
        observer.observe(element);
    }
</script>
```
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

### Other components

- `<PriceLine>` - price line (`IPriceLine`). It has to be nested inside `<[Type]Series>` component.
- `<TimeScale>` - time-scale (`ITimeScaleApi`). It has to be nested inside `<Chart>` component.
- `<PriceScale>` - price-scale (`IPriceScaleApi`). It has to be nested inside `<Chart>` component.

## Typescript
Package is written on TypeScript and transpiled to plain `*.js` and `*.svelte` files. Definition files (including `*.svelte.d.ts`) are provided with package. It is a good place to find list of available properties that can be passed to each component.
