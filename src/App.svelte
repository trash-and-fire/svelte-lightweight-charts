<script lang="ts">
    import {chart} from '.';

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
<main use:chart={{ options, series: [{ data }]}}>

</main>


<style>

</style>
