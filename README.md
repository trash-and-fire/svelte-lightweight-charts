This package is a Svelte wrapper for [lightweight-charts](https://github.com/tradingview/lightweight-charts)

The package is under development.

# [Demo](https://trash-and-fire.github.io/svelte-lightweight-charts/official-samples.html)

Here are some official examples rewritten on Svelte. Each example you can open in the REPL to modify or fork

If you need more information you can see [demo app sources](./src/demo) or [example sources](./src/demo/samples)

# Installing

```bash
npm install lightweight-charts svelte-lightweight-charts
```

# Usage

There are two ways to use this package:
- As set of components

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

- As action
```html
<script>
    import chart from "svelte-lightweight-charts";
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
<div use:chart={{
    options: { width: 800, height: 600 },
    series: [{
        id: 'main',
        type: 'Line',
        data
    }]
}}/>
```
# Core API
`svelte-lightweight-charts` supports chart object and all kind of series objects from `lightweight-charts`. 

## Getting reference to lightweight-chart objects

To get reference of lightweight-chart (`IChartApi`, `ISeriesApi<T>`, etc) instance of a node you can use `ref` property.
```html
<script>
    let chartApi;
</script>
<Chart width={400} height={300} ref={(ref) => chartApi = ref}/>
<button on:click={() => chartApi.priceScale().fitContent()}>Fit Content</button>
```

## Supported components
- `<Chart>` - main chart container (`IChartApi`).
- `<[Type]Series>` - series with specified `[Type]` (`ISeriesApi<Type>`). It has to be nested inside `<Chart>` component.
- `<PriceLine>` - price line (`IPriceLine`). It has to be nested inside `<[Type]Series>` component.

# Typescript support
Package is written on TypeScript and transpiled to plain `*.js` and `*.svelte` files. Definition files (including `*.svelte.d.ts`) are provided with package. It is a good place to find list of available properties that can be passed to each component.
