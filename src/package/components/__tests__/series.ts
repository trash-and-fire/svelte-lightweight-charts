import {describe, it, expect, jest, beforeEach, beforeAll} from '@jest/globals';
import {tick} from 'svelte';
import type {SeriesType} from "lightweight-charts";

jest.unstable_mockModule('lightweight-charts', async () => ({}));

const SERIES_API = {
    applyOptions: jest.fn(),
    setData: jest.fn(),
    setMarkers: jest.fn(),
    seriesType: jest.fn(),
    createPriceLine: jest.fn(),
};
const CHART_API = {
    addAreaSeries: jest.fn(() => SERIES_API),
    addBarSeries: jest.fn(() => SERIES_API),
    addCandlestickSeries: jest.fn(() => SERIES_API),
    addHistogramSeries: jest.fn(() => SERIES_API),
    addLineSeries: jest.fn(() => SERIES_API),
    addBaselineSeries: jest.fn(() => SERIES_API),
    removeSeries: jest.fn(),
}

describe.each([
    ['Area', 'area-series', 'addAreaSeries'],
    ['Bar', 'bar-series', 'addBarSeries'],
    ['Candlestick', 'candlestick-series', 'addCandlestickSeries'],
    ['Histogram', 'histogram-series', 'addHistogramSeries'],
    ['Line', 'line-series', 'addLineSeries'],
    ['Baseline', 'baseline-series', 'addBaselineSeries'],
] satisfies [
    SeriesType, string, keyof typeof CHART_API
][])('%sSeries component', (type: SeriesType, name: string, method: keyof typeof CHART_API) => {
    beforeAll(() => {
        SERIES_API.seriesType = jest.fn(() => type);
    });

    beforeEach(() => {
       jest.clearAllMocks();
    });

    it('should mount', async () => {
        const { default: Series } = await import(`../${name}.svelte`);

        new Series({
            target: document.createElement('div'),
            props: {
                data: [
                    {time: '2018-10-19', open: 180.34, high: 180.99, low: 178.57, close: 179.85},
                ],
                title: 'Series',
                markers: [
                    {
                        time: '2018-10-19',
                        position: 'aboveBar', color: '#f68410',
                        shape: 'circle',
                        text: 'D'
                    }
                ]
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

        expect(CHART_API[method]).toHaveBeenCalledTimes(1);
        expect(CHART_API[method]).toHaveBeenCalledWith({
            title: 'Series',
        });
        expect(SERIES_API.setData).toHaveBeenCalledTimes(1);
        expect(SERIES_API.setData).toHaveBeenCalledWith([
            {time: '2018-10-19', open: 180.34, high: 180.99, low: 178.57, close: 179.85},
        ]);
        expect(SERIES_API.setMarkers).toHaveBeenCalledTimes(1);
        expect(SERIES_API.setMarkers).toHaveBeenCalledWith([
            {
                time: '2018-10-19',
                position: 'aboveBar', color: '#f68410',
                shape: 'circle',
                text: 'D'
            }
        ]);
    });

    it('should update', async () => {
        const { default: Series } = await import(`../${name}.svelte`);

        const component = new Series({
            target: document.createElement('div'),
            props: {
                data: [
                    {time: '2018-10-19', open: 180.34, high: 180.99, low: 178.57, close: 179.85},
                ],
                title: 'Series',
                markers: [
                    {
                        time: '2018-10-19',
                        position: 'aboveBar', color: '#f68410',
                        shape: 'circle',
                        text: 'D'
                    }
                ]
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

       SERIES_API.applyOptions.mockClear();
       SERIES_API.setMarkers.mockClear();

        component.$set({
            data: [],
            title: 'Series',
            visible: true,
            markers: [],
        });

        await tick();

        expect(SERIES_API.applyOptions).toHaveBeenCalledTimes(1);
        expect(SERIES_API.applyOptions.mock.calls[0]).toMatchObject([{
            title: 'Series',
            visible: true,
        }]);

        expect(SERIES_API.setMarkers).toHaveBeenCalledTimes(1);
        expect(SERIES_API.setMarkers).toHaveBeenCalledWith([]);
    });

    it('should destroy', async () => {
        const { default: Series } = await import(`../${name}.svelte`);

        const component = new Series({
            target: document.createElement('div'),
            props: {
                data: [],
                title: 'Series',
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

        component.$destroy();

        await tick();

        expect(CHART_API.removeSeries).toHaveBeenCalledTimes(1);
        expect(CHART_API.removeSeries).toHaveBeenCalledWith(SERIES_API);
    });

    it('should manage reference', async () => {
        const { default: Series } = await import(`../${name}.svelte`);

        const reference = jest.fn();
        const component = new Series({
            target: document.createElement('div'),
            props: {
                data: [],
                title: 'Series',
                visible: true,
                ref: reference,
            },
            context: new Map([['lightweight-chart-context', CHART_API]]),
        });

        await tick();

        expect(reference).toHaveBeenCalledTimes(1);
        expect(reference).toHaveBeenCalledWith(SERIES_API);

        const next = jest.fn();
        component.$set({ ref: next });

        await tick();

        expect(reference).toHaveBeenCalledTimes(2);
        expect(reference).toHaveBeenCalledWith(null);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(SERIES_API);

        component.$destroy();

        await tick();

        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenCalledWith(null)
    });
})
