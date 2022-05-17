import type {IChartApi} from 'lightweight-charts';

import {tick} from 'svelte';
import {describe, it, expect, jest, beforeEach} from '@jest/globals';

jest.unstable_mockModule('lightweight-charts', async () => ({}));

const PRICE_SCALE_API = {
    applyOptions: jest.fn(),
};
const CHART_API = {
    priceScale: jest.fn(() => PRICE_SCALE_API),
} as unknown as IChartApi;


describe('PriceScale component', () => {
    beforeEach(() => {
       jest.clearAllMocks();
    });

    it('should mount', async () => {
        const { default: PriceScale } = await import('../price-scale.svelte');

        new PriceScale({
            target: document.createElement('div'),
            props: {
                id: 'left',
                visible: false,
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

        expect(CHART_API.priceScale).toHaveBeenCalledTimes(1);
        expect(PRICE_SCALE_API.applyOptions).toHaveBeenCalledWith({
            visible: false,
        });
    });

    it('should update', async () => {
        const { default: PriceScale } = await import('../price-scale.svelte');

        const component = new PriceScale({
            target: document.createElement('div'),
            props: {
                id: 'left',
                visible: false,
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

        PRICE_SCALE_API.applyOptions.mockClear();

        component.$set({
            id: 'left',
            visible: true,
        });

        await tick();

        expect(PRICE_SCALE_API.applyOptions).toHaveBeenCalledTimes(1);
        expect(PRICE_SCALE_API.applyOptions).toHaveBeenCalledWith({
            visible: true,
        });
    });

    it('should destroy', async () => {
        const { default: PriceScale } = await import('../price-scale.svelte');

        const component = new PriceScale({
            target: document.createElement('div'),
            props: {
                id: 'left',
                visible: false,
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

        component.$destroy();

        await tick();
    });

    it('should manage reference', async () => {
        const { default: PriceScale } = await import('../price-scale.svelte');

        const reference = jest.fn();
        const component = new PriceScale({
            target: document.createElement('div'),
            props: {
                id: 'left',
                visible: false,
                ref: reference,
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

        expect(reference).toHaveBeenCalledTimes(1);
        expect(reference).toHaveBeenCalledWith(PRICE_SCALE_API);

        const next = jest.fn();
        component.$set({ ref: next });

        await tick();

        expect(reference).toHaveBeenCalledTimes(2);
        expect(reference).toHaveBeenCalledWith(null);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(PRICE_SCALE_API);

        component.$destroy();

        await tick();

        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenCalledWith(null)
    });
})
