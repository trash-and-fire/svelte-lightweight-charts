<script>
    import BarChart from './bar-chart.svelte';
    import CandlestickChart from './candlestick-chart.svelte';
    import CustomFontFamily from './custom-font-family.svelte';
    import CustomPriceFormatter from './custom-price-formatter.svelte';
    import CustomLocale from './custom-locale.svelte';
    import CustomThemes from './custom-themes.svelte';

    const components = [
        BarChart,
        CandlestickChart,
        CustomFontFamily,
        CustomPriceFormatter,
        CustomLocale,
        CustomThemes,
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
