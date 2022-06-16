<svelte:options immutable={true}/>

<script lang="ts">
    import type {LogicalRange, TimeRange, DeepPartial, TimeScaleOptions} from 'lightweight-charts';
    import type {$$PROPS, $$EVENTS_DETAIL} from './time-scale.interface.js';

    import {createEventDispatcher} from 'svelte';
    import {useTimeScaleEffect} from './internal/utils.js';

    const dispatch = createEventDispatcher<$$EVENTS_DETAIL>();

    /**
     * The margin space in bars from the right side of the chart.
     */
    export let rightOffset: $$PROPS['rightOffset'] = undefined
    /**
     * The space between bars in pixels.
     */
    export let barSpacing: $$PROPS['barSpacing'] = undefined
    /**
     * The minimum space between bars in pixels.
     */
    export let minBarSpacing: $$PROPS['minBarSpacing'] = undefined
    /**
     * Prevent scrolling to the left of the first bar.
     */
    export let fixLeftEdge: $$PROPS['fixLeftEdge'] = undefined
    /**
     * Prevent scrolling to the right of the most recent bar.
     */
    export let fixRightEdge: $$PROPS['fixRightEdge'] = undefined
    /**
     * Prevent changing the visible time range during chart resizing.
     */
    export let lockVisibleTimeRangeOnResize: $$PROPS['lockVisibleTimeRangeOnResize'] = undefined
    /**
     * Prevent the hovered bar from moving when scrolling.
     */
    export let rightBarStaysOnScroll: $$PROPS['rightBarStaysOnScroll'] = undefined
    /**
     * Show the time scale border.
     */
    export let borderVisible: $$PROPS['borderVisible'] = undefined
    /**
     * The time scale border color.
     */
    export let borderColor: $$PROPS['borderColor'] = undefined
    /**
     * Show the time scale.
     */
    export let visible: $$PROPS['visible'] = undefined
    /**
     * Show the time, not just the date, in the time scale and vertical crosshair label.
     */
    export let timeVisible: $$PROPS['timeVisible'] = undefined
    /**
     * Show seconds in the time scale and vertical crosshair label in `hh:mm:ss` format for intraday data.
     */
    export let secondsVisible: $$PROPS['secondsVisible'] = undefined
    /**
     * Shift the visible range to the right (into the future) by the number of new bars when new data is added.
     *
     * Note that this only applies when the last bar is visible.
     */
    export let shiftVisibleRangeOnNewBar: $$PROPS['shiftVisibleRangeOnNewBar'] = undefined
    /**
     * Override the default tick marks formatter.
     */
    export let tickMarkFormatter: $$PROPS['tickMarkFormatter'] = undefined

    export let ref: $$PROPS['ref'] = undefined;

    let options: DeepPartial<TimeScaleOptions> = {
        rightOffset,
        barSpacing,
        minBarSpacing,
        fixLeftEdge,
        fixRightEdge,
        lockVisibleTimeRangeOnResize,
        rightBarStaysOnScroll,
        borderVisible,
        borderColor,
        visible,
        timeVisible,
        secondsVisible,
        shiftVisibleRangeOnNewBar,
        tickMarkFormatter,
    };

    $: options = {
        rightOffset,
        barSpacing,
        minBarSpacing,
        fixLeftEdge,
        fixRightEdge,
        lockVisibleTimeRangeOnResize,
        rightBarStaysOnScroll,
        borderVisible,
        borderColor,
        visible,
        timeVisible,
        secondsVisible,
        shiftVisibleRangeOnNewBar,
        tickMarkFormatter,
    };

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
            options,
            onVisibleTimeRangeChange: handleVisibleTimeRangeChange,
            onVisibleLogicalRangeChange: handleVisibleLogicalRangeChange,
            onSizeChange: handleSizeChange,
        },
        ref
    ]);
</script>
