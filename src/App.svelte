<script lang="ts">
    import {chart} from '.';
    import type {SeriesProps} from './types';

    let width = 400;
    let height = 300;

    $: options = {
        width,
        height,
    };

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
        reference: handleReference,
    }

    const histogram: SeriesProps = {
        id: 'volume',
        type: 'Histogram',
        data: data.map(<T extends { value: number }>(item: T) => ({ ...item, value: (item.value - Math.random() * 10 - 10)/ 2 })),
        reference: handleReference,
    }

    function handleReference<T>(ref: T | null): void {
        // eslint-disable-next-line no-console
        console.log(ref);
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
</form>
<main use:chart={{ options, series: [area, histogram], reference: handleReference }}>

</main>


<style>

</style>
