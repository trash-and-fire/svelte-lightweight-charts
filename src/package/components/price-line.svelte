<script lang="ts">
    import type {PriceLineOptions} from 'lightweight-charts';
    import type {$$PROPS} from './price-line.interface';

    import {afterUpdate, onDestroy} from 'svelte';
    import {context} from './utils';
    import {line} from '../lines';

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
    const subject = line(context(), {
        id,
        options,
    });

    $: subject.update({
        id,
        options,
    });

    afterUpdate(() => {
        subject.updateReference(ref);
    });

    onDestroy(() => {
        subject.destroy();
    });
</script>
