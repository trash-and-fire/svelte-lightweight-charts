This package is a Svelte wrapper for [lightweight-charts](https://github.com/tradingview/lightweight-charts)

The package is under development.

# Installing

```bash
npm install lightweight-charts svelte-lightweight-charts
```

# Usage

There are two ways to use this package:
- As set of components

```sveltehtml
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
```sveltehtml
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

If you need more examples you can see [demo app](./src/demo) or [samples](./src/demo/samples)
