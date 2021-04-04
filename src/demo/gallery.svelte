<script>
    import BarChart from './samples/bar-chart.svelte';
    import CandlestickChart from './samples/candlestick-chart.svelte';
    import CustomFontFamily from './samples/custom-font-family.svelte';
    import CustomPriceFormatter from './samples/custom-price-formatter.svelte';
    import CustomLocale from './samples/custom-locale.svelte';
    import CustomThemes from './samples/custom-themes.svelte';
    import CustomWatermark from './samples/custom-watermark.svelte';
    import Legend from './samples/legend.svelte';

    const components = [
        BarChart,
        CandlestickChart,
        CustomFontFamily,
        CustomPriceFormatter,
        CustomLocale,
        CustomThemes,
        CustomWatermark,
        Legend,
    ];
</script>

<div class="container">
    {#each components as component (component)}
        <div class="item">
            <svelte:component this={component}/>
        </div>
    {/each}
</div>

<style>
    .container {
        display: flex;
        width: 100%;

        flex-wrap: wrap;
        justify-content: center;
        margin: 0 -20px 0;
        padding-bottom: 30px;
    }

    .item {
        flex: none;
        margin: 0 20px 0;
    }
</style>
