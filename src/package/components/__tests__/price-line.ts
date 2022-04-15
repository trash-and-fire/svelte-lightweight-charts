import {describe, it, expect, jest, beforeEach} from '@jest/globals';
import {tick} from 'svelte';

jest.unstable_mockModule('lightweight-charts', async () => ({}));

const LINE_API = {
    applyOptions: jest.fn(() => void 0),
};
const SERIES_API = {
    createPriceLine: jest.fn(() => LINE_API),
    removePriceLine: jest.fn(() => void 0),
};

describe('PriceLine component', () => {
    beforeEach(() => {
       jest.clearAllMocks();
    });

    it('should mount', async () => {
        const { default: PriceLine } = await import('../price-line.svelte');

        new PriceLine({
            target: document.createElement('div'),
            props: {
                price: 41.0,
                color: 'green',
                lineWidth: 2,
                lineStyle: 1,
                axisLabelVisible: true,
                title: 'P/L 500',
            },
            context: new Map([['lightweight-chart-context', SERIES_API]]),
        });

        await tick();

        expect(SERIES_API.createPriceLine).toHaveBeenCalledTimes(1);
        expect(SERIES_API.createPriceLine).toHaveBeenCalledWith({
            price: 41.0,
            color: 'green',
            lineWidth: 2,
            lineStyle: 1,
            axisLabelVisible: true,
            title: 'P/L 500',
        });
    });

    it('should update', async () => {
        const { default: PriceLine } = await import('../price-line.svelte');

        const component = new PriceLine({
            target: document.createElement('div'),
            props: {
                price: 41.0,
                color: 'green',
                lineWidth: 2,
                lineStyle: 1,
                axisLabelVisible: true,
                title: 'P/L 500',
            },
            context: new Map([['lightweight-chart-context', SERIES_API]]),
        });

        await tick();

        LINE_API.applyOptions.mockClear();

        component.$set({
            price: 41.0,
            color: 'green',
            lineWidth: 2,
            lineStyle: 1,
            axisLabelVisible: true,
            title: 'Line',
        });

        await tick();

        expect(LINE_API.applyOptions).toHaveBeenCalledTimes(1);
        expect(LINE_API.applyOptions).toHaveBeenCalledWith({
            price: 41.0,
            color: 'green',
            lineWidth: 2,
            lineStyle: 1,
            axisLabelVisible: true,
            title: 'Line',
        });
    });

    it('should destroy', async () => {
        const { default: PriceLine } = await import('../price-line.svelte');

        const component = new PriceLine({
            target: document.createElement('div'),
            props: {
                price: 41.0,
                color: 'green',
                lineWidth: 2,
                lineStyle: 1,
                axisLabelVisible: true,
                title: 'P/L 500',
            },
            context: new Map([['lightweight-chart-context', SERIES_API]]),
        });

        await tick();

        component.$destroy();

        await tick();

        expect(SERIES_API.removePriceLine).toHaveBeenCalledTimes(1);
        expect(SERIES_API.removePriceLine).toHaveBeenCalledWith(LINE_API);
    });

    it('should manage reference', async () => {
        const { default: PriceLine } = await import('../price-line.svelte');

        const reference = jest.fn();
        const component = new PriceLine({
            target: document.createElement('div'),
            props: {
                price: 41.0,
                color: 'green',
                lineWidth: 2,
                lineStyle: 1,
                axisLabelVisible: true,
                title: 'P/L 500',
                ref: reference,
            },
            context: new Map([['lightweight-chart-context', SERIES_API]]),
        });

        await tick();

        expect(reference).toHaveBeenCalledTimes(1);
        expect(reference).toHaveBeenCalledWith(LINE_API);

        const next = jest.fn();
        component.$set({ ref: next });

        await tick();

        expect(reference).toHaveBeenCalledTimes(2);
        expect(reference).toHaveBeenCalledWith(null);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(LINE_API);

        component.$destroy();

        await tick();

        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenCalledWith(null)
    });
})
