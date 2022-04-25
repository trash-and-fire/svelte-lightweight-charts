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

```html
<script>
    import Chart from "svelte-lightweight-charts/components/chart.svelte";
    import LineSeries from "svelte-lightweight-charts/components/line-series.svelte";
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
```html
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
```
container?: {
    ref?: (element: HTMLElement | null) => void;
    class?: string;
    id?: string;
}
```
It might be helpful to [auto-size](https://svelte.dev/repl/22c14c4729d44d65a69346d1e3cc6e89) your chart container via ResizeObserver. 
```sveltehtml
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
- [`on:click`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/IChartApi#subscribecrosshairmove): `(event: CustomEvent<MouseEventParams>) => void;`

Use the `ref` property to get a reference to a [`IChartApi`](https://tradingview.github.io/lightweight-charts/docs/api/interfaces/IChartApi) instance

- `<[Type]Series>` - series with specified `[Type]` (`ISeriesApi<Type>`). It has to be nested inside `<Chart>` component.
- `<PriceLine>` - price line (`IPriceLine`). It has to be nested inside `<[Type]Series>` component.
- `<TimeScale>` - time-scale (`ITimeScaleApi`). It has to be nested inside `<Chart>` component.
- `<PriceScale>` - price-scale (`IPriceScaleApi`). It has to be nested inside `<Chart>` component.

## Typescript
Package is written on TypeScript and transpiled to plain `*.js` and `*.svelte` files. Definition files (including `*.svelte.d.ts`) are provided with package. It is a good place to find list of available properties that can be passed to each component.
