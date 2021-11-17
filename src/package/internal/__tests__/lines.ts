import type {ISeriesApi, PriceLineOptions} from 'lightweight-charts';

import {jest, describe, it, expect, beforeEach} from '@jest/globals';

jest.unstable_mockModule('lightweight-charts', async () => ({}));

const LINE_API = {
    applyOptions: jest.fn(() => void 0),
};
const SERIES_API = {
    createPriceLine: jest.fn(() => LINE_API),
    removePriceLine: jest.fn(() => void 0),
} as unknown as ISeriesApi<'Line'>

const OPTIONS: PriceLineOptions = {
    price: 41.0,
    color: 'green',
    lineWidth: 2,
    lineStyle: 1,
    axisLabelVisible: true,
    title: 'P/L 500',
};

describe('Synthetic action: "lines"', () => {
    beforeEach(() => {
       jest.clearAllMocks();
    });
    it('should create synthetic action object', async () => {
        const {line} = await import('../lines');

        const handle = line(SERIES_API, {
            id: 'price',
            options: OPTIONS,
        });
        expect(handle).toBeDefined();
    });

    it('should call "createPriceLine" on series when created', async () => {
        const {line} = await import('../lines');

        line(SERIES_API, {
            id: 'price',
            options: OPTIONS,
        });
        expect(SERIES_API.createPriceLine).toHaveBeenCalledTimes(1);
        expect(SERIES_API.createPriceLine).toHaveBeenCalledWith(OPTIONS);
    });

    it('should call "removePriceLine" on series when destroyed', async () => {
        const {line} = await import('../lines');

        const handle = line(SERIES_API, {
            id: 'price',
            options: OPTIONS,
        });
        handle.destroy();

        expect(SERIES_API.removePriceLine).toHaveBeenCalledTimes(1);
        expect(SERIES_API.removePriceLine).toHaveBeenCalledWith(LINE_API);
    });

    it('should call "applyOptions" on line when updated', async () => {
        const {line} = await import('../lines');

        const handle = line(SERIES_API, {
            id: 'price',
            options: { ...OPTIONS, lineStyle: 1 },
        });
        handle.update({ id: 'price', options: OPTIONS });

        expect(LINE_API.applyOptions).toHaveBeenCalledTimes(1);
        expect(LINE_API.applyOptions).toHaveBeenCalledWith({...OPTIONS, lineStyle: 1});
    });

    it('should handle reference', async () => {
        const {line} = await import('../lines');

        const handle = line(SERIES_API, {
            id: 'price',
            options: OPTIONS,
        });

        const initial = jest.fn();
        handle.updateReference(initial)

        expect(initial).toHaveBeenCalledTimes(1);
        expect(initial).toHaveBeenCalledWith(LINE_API);

        const next = jest.fn();
        handle.updateReference(next);

        expect(initial).toHaveBeenCalledTimes(2);
        expect(initial).toHaveBeenCalledWith(null);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(LINE_API);

        handle.destroy();

        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenCalledWith(null);
    });
});
