import type {IChartApi} from 'lightweight-charts';
import type {PriceScaleParams} from '../../types';

import {beforeEach, describe, expect, it, jest} from '@jest/globals';

jest.unstable_mockModule('lightweight-charts', async () => ({}));

const PRICE_SCALE_API = {
    applyOptions: jest.fn(),
};
const CHART_API = {
    priceScale: jest.fn(() => PRICE_SCALE_API),
} as unknown as IChartApi;

describe('Synthetic action: "price-scale"', () => {
    beforeEach(() => {
       jest.clearAllMocks();
    });

    it('should create synthetic action object', async () => {
        const {priceScale} = await import('../price-scale');

        const handle = priceScale(CHART_API, { id: 'left' });
        expect(handle).toBeDefined();
    });

    it('should call "priceScale" on chart when created', async () => {
        const {priceScale} = await import('../price-scale');

        priceScale(CHART_API, { id: 'left'});
        expect(CHART_API.priceScale).toHaveBeenCalledTimes(1);
        expect(CHART_API.priceScale).toHaveBeenLastCalledWith('left');
    });

    it('should handle reference', async () => {
        const {priceScale} = await import('../price-scale');

        const handle = priceScale(CHART_API, { id: 'left' });

        const initial = jest.fn();
        handle.updateReference(initial)

        expect(initial).toHaveBeenCalledTimes(1);
        expect(initial).toHaveBeenCalledWith(PRICE_SCALE_API);

        const next = jest.fn();
        handle.updateReference(next);

        expect(initial).toHaveBeenCalledTimes(2);
        expect(initial).toHaveBeenCalledWith(null);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(PRICE_SCALE_API);

        handle.destroy();

        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenCalledWith(null);
    });

    it('should handle options', async () => {
        const {priceScale} = await import('../price-scale');

        const params: PriceScaleParams = {
            id: 'left',
            options: {
                visible: false,
            },
        }
        const handle = priceScale(CHART_API, params);

        expect(PRICE_SCALE_API.applyOptions).toHaveBeenCalledTimes(1);
        expect(PRICE_SCALE_API.applyOptions).toHaveBeenLastCalledWith(params.options);

        const nextParams: PriceScaleParams = {
            id: 'left',
            options: {
                visible: true,
            },
        }
        handle.update(nextParams);

        expect(PRICE_SCALE_API.applyOptions).toHaveBeenCalledTimes(2);
        expect(PRICE_SCALE_API.applyOptions).toHaveBeenLastCalledWith(nextParams.options);
    });
});
