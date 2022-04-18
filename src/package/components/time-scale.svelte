<svelte:options immutable={true}/>

<script lang="ts">
    import type {LogicalRange, TimeRange} from 'lightweight-charts';
    import type {$$PROPS, $$EVENTS_DETAIL} from './time-scale.interface';

    import {createEventDispatcher} from 'svelte';
    import {useTimeScaleEffect} from './internal/utils';

    const dispatch = createEventDispatcher<$$EVENTS_DETAIL>();

    export let ref: $$PROPS['ref'] = undefined;

    function handleVisibleTimeRangeChange(timeRange: TimeRange | null): void {
        dispatch('visibleTimeRangeChange', timeRange);
    }

    function handleVisibleLogicalRangeChange(logicalRange: LogicalRange | null): void {
        dispatch('visibleLogicalRangeChange', logicalRange);
    }

    function handleSizeChange(width: number, height: number): void {
        dispatch('sizeChange', {width, height});
    }

    useTimeScaleEffect(() => [
        {
            onVisibleTimeRangeChange: handleVisibleTimeRangeChange,
            onVisibleLogicalRangeChange: handleVisibleLogicalRangeChange,
            onSizeChange: handleSizeChange,
        },
        ref
    ]);
</script>
