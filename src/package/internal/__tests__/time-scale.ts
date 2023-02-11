import type {IChartApi} from 'lightweight-charts';
import type {TimeScaleParams} from '../time-scale';

import {beforeEach, describe, expect, it, jest} from '@jest/globals';

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

describe('Synthetic action: "time-scale"', () => {
    beforeEach(() => {
       jest.clearAllMocks();
    });

    it('should create synthetic action object', async () => {
        const {timeScale} = await import('../time-scale.js');

        const handle = timeScale(CHART_API, {});
        expect(handle).toBeDefined();
    });

    it('should call "timeScale" on chart when created', async () => {
        const {timeScale} = await import('../time-scale.js');

        timeScale(CHART_API, {});
        expect(CHART_API.timeScale).toHaveBeenCalledTimes(1);
    });

    it('should handle event listeners', async () => {
        const {timeScale} = await import('../time-scale.js');

        const params: TimeScaleParams = {
            onSizeChange: jest.fn(),
            onVisibleLogicalRangeChange: jest.fn(),
            onVisibleTimeRangeChange: jest.fn(),
        }
        const handle = timeScale(CHART_API, params);

        expect(TIME_SCALE_API.subscribeSizeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.subscribeSizeChange).toHaveBeenLastCalledWith(params.onSizeChange);
        expect(TIME_SCALE_API.subscribeVisibleLogicalRangeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.subscribeVisibleLogicalRangeChange).toHaveBeenLastCalledWith(params.onVisibleLogicalRangeChange);
        expect(TIME_SCALE_API.subscribeVisibleTimeRangeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.subscribeVisibleTimeRangeChange).toHaveBeenLastCalledWith(params.onVisibleTimeRangeChange);

        const nextParams: TimeScaleParams = {
            onSizeChange: jest.fn(),
            onVisibleLogicalRangeChange: jest.fn(),
            onVisibleTimeRangeChange: jest.fn(),
        }
        handle.update(nextParams);

        expect(TIME_SCALE_API.unsubscribeSizeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.unsubscribeSizeChange).toHaveBeenLastCalledWith(params.onSizeChange);
        expect(TIME_SCALE_API.unsubscribeVisibleLogicalRangeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.unsubscribeVisibleLogicalRangeChange).toHaveBeenLastCalledWith(params.onVisibleLogicalRangeChange);
        expect(TIME_SCALE_API.unsubscribeVisibleTimeRangeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.unsubscribeVisibleTimeRangeChange).toHaveBeenLastCalledWith(params.onVisibleTimeRangeChange);

        expect(TIME_SCALE_API.subscribeSizeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.subscribeSizeChange).toHaveBeenLastCalledWith(nextParams.onSizeChange);
        expect(TIME_SCALE_API.subscribeVisibleLogicalRangeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.subscribeVisibleLogicalRangeChange).toHaveBeenLastCalledWith(nextParams.onVisibleLogicalRangeChange);
        expect(TIME_SCALE_API.subscribeVisibleTimeRangeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.subscribeVisibleTimeRangeChange).toHaveBeenLastCalledWith(nextParams.onVisibleTimeRangeChange);

        handle.destroy();

        expect(TIME_SCALE_API.unsubscribeSizeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.unsubscribeSizeChange).toHaveBeenLastCalledWith(nextParams.onSizeChange);
        expect(TIME_SCALE_API.unsubscribeVisibleLogicalRangeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.unsubscribeVisibleLogicalRangeChange).toHaveBeenLastCalledWith(nextParams.onVisibleLogicalRangeChange);
        expect(TIME_SCALE_API.unsubscribeVisibleTimeRangeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.unsubscribeVisibleTimeRangeChange).toHaveBeenLastCalledWith(nextParams.onVisibleTimeRangeChange);
    });

    it('should handle reference', async () => {
        const {timeScale} = await import('../time-scale.js');

        const handle = timeScale(CHART_API, {});

        const initial = jest.fn();
        handle.updateReference(initial)

        expect(initial).toHaveBeenCalledTimes(1);
        expect(initial).toHaveBeenCalledWith(TIME_SCALE_API);

        const next = jest.fn();
        handle.updateReference(next);

        expect(initial).toHaveBeenCalledTimes(2);
        expect(initial).toHaveBeenCalledWith(null);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(TIME_SCALE_API);

        handle.destroy();

        expect(next).toHaveBeenCalledTimes(2);
        expect(next).toHaveBeenCalledWith(null);
    });

    it('should handle options', async () => {
        const {timeScale} = await import('../time-scale.js');

        const params: TimeScaleParams = {
            options: {},
        }
        const handle = timeScale(CHART_API, params);

        expect(TIME_SCALE_API.applyOptions).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.applyOptions).toHaveBeenLastCalledWith(params.options);

        const nextParams: TimeScaleParams = {
            options: {},
        }
        handle.update(nextParams);

        expect(TIME_SCALE_API.applyOptions).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.applyOptions).toHaveBeenLastCalledWith(nextParams.options);
    });
});
