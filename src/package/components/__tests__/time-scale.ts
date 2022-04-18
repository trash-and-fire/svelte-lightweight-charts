import type {IChartApi} from 'lightweight-charts';

import {tick} from 'svelte';
import {describe, it, expect, jest, beforeEach} from '@jest/globals';

jest.unstable_mockModule('lightweight-charts', async () => ({}));

const TIME_SCALE_API = {
    subscribeVisibleTimeRangeChange: jest.fn(),
    unsubscribeVisibleTimeRangeChange: jest.fn(),
    subscribeVisibleLogicalRangeChange: jest.fn(),
    unsubscribeVisibleLogicalRangeChange: jest.fn(),
    subscribeSizeChange: jest.fn(),
    unsubscribeSizeChange: jest.fn(),
    applyOptions: jest.fn(),
};
const CHART_API = {
    timeScale: jest.fn(() => TIME_SCALE_API),
} as unknown as IChartApi;


describe('PriceLine component', () => {
    beforeEach(() => {
       jest.clearAllMocks();
    });

    it('should mount', async () => {
        const { default: TimeScale } = await import('../time-scale.svelte');

        new TimeScale({
            target: document.createElement('div'),
            props: {
                visible: false,
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

        expect(CHART_API.timeScale).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.applyOptions).toHaveBeenCalledWith({
            visible: false,
        });
    });

    it('should update', async () => {
        const { default: TimeScale } = await import('../time-scale.svelte');

        const component = new TimeScale({
            target: document.createElement('div'),
            props: {
                visible: false,
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

        TIME_SCALE_API.applyOptions.mockClear();

        component.$set({
            visible: true,
        });

        await tick();

        expect(TIME_SCALE_API.applyOptions).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.applyOptions).toHaveBeenCalledWith({
            visible: true,
        });
    });

    it('should destroy', async () => {
        const { default: TimeScale } = await import('../time-scale.svelte');

        const component = new TimeScale({
            target: document.createElement('div'),
            props: {
                visible: false,
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

        component.$destroy();

        await tick();
    });

    it('should manage reference', async () => {
        const { default: TimeScale } = await import('../time-scale.svelte');

        const reference = jest.fn();
        const component = new TimeScale({
            target: document.createElement('div'),
            props: {
                visible: false,
                ref: reference,
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

        expect(reference).toHaveBeenCalledTimes(1);
        expect(reference).toHaveBeenCalledWith(TIME_SCALE_API);

        const next = jest.fn();
        component.$set({ ref: next });

        await tick();

        expect(reference).toHaveBeenCalledTimes(2);
        expect(reference).toHaveBeenCalledWith(null);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(TIME_SCALE_API);

        component.$destroy();

        await tick();

        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenCalledWith(null)
    });
})
