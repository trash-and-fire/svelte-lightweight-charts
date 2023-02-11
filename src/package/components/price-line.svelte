<svelte:options immutable={true}/>

<script lang="ts">
    import type {PriceLineOptions} from 'lightweight-charts';
    import type {$$PROPS} from './price-line.interface.js';

    import {useLineEffect} from './internal/utils.js';

    export let price: $$PROPS['price'];
    export let color: $$PROPS['color'];
    export let lineWidth: $$PROPS['lineWidth'];
    export let lineStyle: $$PROPS['lineStyle'];
    export let axisLabelVisible: $$PROPS['axisLabelVisible'];
    export let title: $$PROPS['title'];

    export let ref: $$PROPS['ref'] = undefined;

    let options: PriceLineOptions = {
        price,
        color,
        lineWidth,
        lineStyle,
        axisLabelVisible,
        title,
    };
    $: options = {
        price,
        color,
        lineWidth,
        lineStyle,
        axisLabelVisible,
        title,
    };

    const id = performance.now().toString();
    useLineEffect(() => [
        {
            id,
            options,
        },
        ref
    ])
</script>
