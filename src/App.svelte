<script lang="ts">
    import type {ISeriesApi} from 'lightweight-charts';
    import type {SeriesProps} from './types';
    import {chart} from '.';

    let width = 400;
    let height = 300;

    let intraday = false;

    let day = new Date(2019, 4, 20);
    let main: ISeriesApi<'Area'> | null = null;
    let volume: ISeriesApi<'Histogram'> | null = null;

    let ticker: number | null = null;

    $: options = {
        width,
        height,
    };

    $: {
        main?.update({ time: day.toISOString().slice(0, 10), value: 90 - 20 * Math.random() });
        volume?.update({ time: day.toISOString().slice(0, 10), value: (90 - Math.random() * 45)/ 2 });
    }

    $: if (ticker !== null) {
        setupTicker(!intraday);
    }

    const data = [
        {time: '2019-04-11', value: 80.01},
        {time: '2019-04-12', value: 96.63},
        {time: '2019-04-13', value: 76.64},
        {time: '2019-04-14', value: 81.89},
        {time: '2019-04-15', value: 74.43},
        {time: '2019-04-16', value: 80.01},
        {time: '2019-04-17', value: 96.63},
        {time: '2019-04-18', value: 76.64},
        {time: '2019-04-19', value: 81.89},
        {time: '2019-04-20', value: 74.43},
    ];

    const area: SeriesProps = {
        id: 'main',
        type: 'Area',
        data: data,
        reference: (ref: ISeriesApi<'Area'> | null) => main = ref,
    }

    const histogram: SeriesProps = {
        id: 'volume',
        type: 'Histogram',
        data: data.map(<T extends { value: number }>(item: T) => ({
            ...item,
            value: (item.value - Math.random() * 10 - 10)/ 2
        })),
        reference: (ref: ISeriesApi<'Histogram'> | null) => volume = ref,
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
</script>

<form>
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
    <label>
        Intraday <input type="checkbox" name="intraday" id="intraday" bind:checked={intraday}>
    </label>
    <button on:click={handleTicker} type="button">{ ticker ? 'Stop' : 'Start' }</button>
</form>
<main use:chart={{ options, series: [area, histogram], reference: handleReference }}>

</main>


<style>

</style>
