import type {IChartApi, LineData, SeriesDataItemTypeMap, SeriesType, UTCTimestamp} from 'lightweight-charts';

import {beforeEach, describe, expect, it, jest} from '@jest/globals';

jest.unstable_mockModule('lightweight-charts', async () => ({}));

const SERIES_API = {
    seriesType: jest.fn(() => 'Line'),
    applyOptions: jest.fn(),
    setData: jest.fn(),
    setMarkers: jest.fn(),
};
const CHART_API = {
    addLineSeries: jest.fn(() => SERIES_API),
    addAreaSeries: jest.fn(() => SERIES_API),
    addCandlestickSeries: jest.fn(() => SERIES_API),
    removeSeries: jest.fn(),
} as unknown as IChartApi;

describe('Synthetic action: series', function () {
    beforeEach(() => {
       jest.clearAllMocks();
    });

    it('should create synthetic action object', async () => {
        const {series} = await import('../series.js');

        const subject = series(CHART_API, {
            id: 'series',
            type: 'Line',
            data: [],
            markers: [],
        });

        expect(subject).toBeDefined();
    });

    it('should call "addLineSeries" when created', async () => {
        const {series} = await import('../series.js');

        const options = {};
        series(CHART_API, {
            id: 'series',
            type: 'Line',
            data: [],
            markers: [],
            options,
        });

        expect(CHART_API.addLineSeries).toHaveBeenCalledTimes(1);
        expect(CHART_API.addLineSeries).toHaveBeenCalledWith(options);
    });

    it('should call "setData" when created', async () => {
        const {series} = await import('../series.js');

        const data: SeriesDataItemTypeMap['Line'][] = [];
        series(CHART_API, {
            id: 'series',
            type: 'Line',
            data,
            markers: [],
        });

        expect(SERIES_API.setData).toHaveBeenCalledTimes(1);
        expect(SERIES_API.setData).toHaveBeenCalledWith(data);
    });

    it('should call "removeSeries" when destroyed', async () => {
        const {series} = await import('../series.js');

        const subject = series(CHART_API, {
            id: 'series',
            type: 'Line',
            data: [],
            markers: [],
        });
        subject.destroy();

        expect(CHART_API.removeSeries).toHaveBeenCalledTimes(1);
        expect(CHART_API.removeSeries).toHaveBeenCalledWith(SERIES_API);
    });

    it('should call "applyOptions" when updated', async () => {
        const {series} = await import('../series.js');

        const subject = series(CHART_API, {
            id: 'series',
            type: 'Line',
            data: [],
            options: {},
            markers: [],
        });
        subject.update({
            id: 'series',
            type: 'Line',
            data: [],
            options: {
                color: '#FFFFFF'
            },
            markers: [],
        });

        expect(SERIES_API.applyOptions).toHaveBeenCalledTimes(1);
        expect(SERIES_API.applyOptions).toHaveBeenCalledWith({
            color: '#FFFFFF'
        });
    });

    it('should handle reference', async () => {
        const {series} = await import('../series.js');

        const subject = series(CHART_API, {
            id: 'series',
            type: 'Line',
            data: [],
            markers: [],
        });

        const initial = jest.fn();
        subject.updateReference(initial)

        expect(initial).toHaveBeenCalledTimes(1);
        expect(initial).toHaveBeenCalledWith(SERIES_API);

        const next = jest.fn();
        subject.updateReference(next);

        expect(initial).toHaveBeenCalledTimes(2);
        expect(initial).toHaveBeenCalledWith(null);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(SERIES_API);

        subject.destroy();

        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenCalledWith(null);
    });

    it('should call "createAreaSeries" when series type changed', async () => {
        const {series} = await import('../series.js');

        const subject = series(CHART_API, {
            id: 'series',
            type: 'Line' as SeriesType,
            data: [],
            options: {},
            markers: [],
        });

        jest.clearAllMocks();

        subject.update({
            id: 'series',
            type: 'Area',
            data: [],
            options: {},
            markers: [],
        });

        expect(CHART_API.addAreaSeries).toHaveBeenCalledTimes(1);
        expect(CHART_API.addAreaSeries).toHaveBeenCalledWith({});
    });

    it('should destroy previous lines when series type changed', async () => {
        const {series} = await import('../series.js');

        const subject = series(CHART_API, {
            id: 'series',
            type: 'Line' as SeriesType,
            data: [],
            options: {},
            markers: [],
        });

        jest.clearAllMocks();

        subject.update({
            id: 'series',
            type: 'Area',
            data: [],
            options: {},
            markers: [],
        });
    });

    it('should handle reference when series type changed', async () => {
        const {series} = await import('../series.js');

        const subject = series(CHART_API, {
            id: 'series',
            type: 'Line' as SeriesType,
            data: [],
            options: {},
            markers: [],
        });
        const reference = jest.fn();
        subject.updateReference(reference);

        jest.clearAllMocks();

        subject.update({
            id: 'series',
            type: 'Area',
            data: [],
            options: {},
            markers: [],
        });

        expect(reference).toHaveBeenCalledTimes(2);
        expect(reference).toHaveBeenNthCalledWith(1, null);
        expect(reference).toHaveBeenNthCalledWith(2, SERIES_API);
    });

    it('should update data when reactive', async () => {
        const {series} = await import('../series.js');

        const subject = series(CHART_API, {
            id: 'series',
            type: 'Line' as SeriesType,
            reactive: true,
            data: [] as LineData[],
            options: {},
            markers: [],
        });

        expect(SERIES_API.setData).toHaveBeenCalledTimes(1);
        expect(SERIES_API.setData).toHaveBeenLastCalledWith([]);

        subject.update({
            id: 'series',
            type: 'Line' as SeriesType,
            reactive: true,
            data: [{
                time: 0 as UTCTimestamp,
                value: 123,
            }],
            options: {},
            markers: [],
        });

        expect(SERIES_API.setData).toHaveBeenCalledTimes(2);
        expect(SERIES_API.setData).toHaveBeenLastCalledWith([{
            time: 0,
            value: 123,
        }]);
    });

    it('should not update data when not reactive', async () => {
        const {series} = await import('../series.js');

        const subject = series(CHART_API, {
            id: 'series',
            type: 'Line' as SeriesType,
            data: [] as LineData[],
            options: {},
            markers: [],
        });

        expect(SERIES_API.setData).toHaveBeenCalledTimes(1);
        expect(SERIES_API.setData).toHaveBeenLastCalledWith([]);

        subject.update({
            id: 'series',
            type: 'Line' as SeriesType,
            data: [{
                time: 0 as UTCTimestamp,
                value: 123,
            }],
            options: {},
            markers: [],
        });

        expect(SERIES_API.setData).toHaveBeenCalledTimes(1);
    });

    it('should set markers', async () => {
        const {series} = await import('../series.js');

        const subject = series(CHART_API, {
            id: 'series',
            type: 'Candlestick' as SeriesType,
            data: [
                {time: '2018-10-19', open: 180.34, high: 180.99, low: 178.57, close: 179.85},
            ],
            options: {},
            markers: [
                {
                    time: '2018-10-19',
                    position: 'aboveBar', color: '#f68410',
                    shape: 'circle',
                    text: 'D'
                }
            ]
        });

        expect(SERIES_API.setMarkers).toHaveBeenCalledTimes(1);
        expect(SERIES_API.setMarkers).toHaveBeenLastCalledWith([
            {
                time: '2018-10-19',
                position: 'aboveBar', color: '#f68410',
                shape: 'circle',
                text: 'D'
            }
        ]);

        subject.update({
            id: 'series',
            type: 'Candlestick' as SeriesType,
            data: [
                {time: '2018-10-19', open: 180.34, high: 180.99, low: 178.57, close: 179.85},
            ],
            options: {},
            markers: [],
        });

        expect(SERIES_API.setMarkers).toHaveBeenCalledTimes(2);
        expect(SERIES_API.setMarkers).toHaveBeenLastCalledWith([]);
    });

    it('should recreate custom series when view changed', () => {
        // TODO
    });

    it('should recreate custom series when [type, view]: ["custom", "view1"] -> ["line", null] -> ["custom", "view2"] -> ["custom", "view1"]', () => {
        // TODO
    });
});
