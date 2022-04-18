import type {IChartApi} from 'lightweight-charts';
import type {TimeScaleParams} from '../../types';

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
        const {timeScale} = await import('../time-scale');

        const handle = timeScale(CHART_API, {});
        expect(handle).toBeDefined();
    });

    it('should call "timeScale" on chart when created', async () => {
        const {timeScale} = await import('../time-scale');

        timeScale(CHART_API, {});
        expect(CHART_API.timeScale).toHaveBeenCalledTimes(1);
    });

    it('should handle event listeners', async () => {
        const {timeScale} = await import('../time-scale');

        const options: TimeScaleParams = {
            onSizeChange: jest.fn(),
            onVisibleLogicalRangeChange: jest.fn(),
            onVisibleTimeRangeChange: jest.fn(),
        }
        const handle = timeScale(CHART_API, options);

        expect(TIME_SCALE_API.subscribeSizeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.subscribeSizeChange).toHaveBeenLastCalledWith(options.onSizeChange);
        expect(TIME_SCALE_API.subscribeVisibleLogicalRangeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.subscribeVisibleLogicalRangeChange).toHaveBeenLastCalledWith(options.onVisibleLogicalRangeChange);
        expect(TIME_SCALE_API.subscribeVisibleTimeRangeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.subscribeVisibleTimeRangeChange).toHaveBeenLastCalledWith(options.onVisibleTimeRangeChange);

        const nextOptions: TimeScaleParams = {
            onSizeChange: jest.fn(),
            onVisibleLogicalRangeChange: jest.fn(),
            onVisibleTimeRangeChange: jest.fn(),
        }
        handle.update(nextOptions);

        expect(TIME_SCALE_API.unsubscribeSizeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.unsubscribeSizeChange).toHaveBeenLastCalledWith(options.onSizeChange);
        expect(TIME_SCALE_API.unsubscribeVisibleLogicalRangeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.unsubscribeVisibleLogicalRangeChange).toHaveBeenLastCalledWith(options.onVisibleLogicalRangeChange);
        expect(TIME_SCALE_API.unsubscribeVisibleTimeRangeChange).toHaveBeenCalledTimes(1);
        expect(TIME_SCALE_API.unsubscribeVisibleTimeRangeChange).toHaveBeenLastCalledWith(options.onVisibleTimeRangeChange);

        expect(TIME_SCALE_API.subscribeSizeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.subscribeSizeChange).toHaveBeenLastCalledWith(nextOptions.onSizeChange);
        expect(TIME_SCALE_API.subscribeVisibleLogicalRangeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.subscribeVisibleLogicalRangeChange).toHaveBeenLastCalledWith(nextOptions.onVisibleLogicalRangeChange);
        expect(TIME_SCALE_API.subscribeVisibleTimeRangeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.subscribeVisibleTimeRangeChange).toHaveBeenLastCalledWith(nextOptions.onVisibleTimeRangeChange);

        handle.destroy();

        expect(TIME_SCALE_API.unsubscribeSizeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.unsubscribeSizeChange).toHaveBeenLastCalledWith(nextOptions.onSizeChange);
        expect(TIME_SCALE_API.unsubscribeVisibleLogicalRangeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.unsubscribeVisibleLogicalRangeChange).toHaveBeenLastCalledWith(nextOptions.onVisibleLogicalRangeChange);
        expect(TIME_SCALE_API.unsubscribeVisibleTimeRangeChange).toHaveBeenCalledTimes(2);
        expect(TIME_SCALE_API.unsubscribeVisibleTimeRangeChange).toHaveBeenLastCalledWith(nextOptions.onVisibleTimeRangeChange);
    });

    it('should handle reference', async () => {
        const {timeScale} = await import('../time-scale');

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
});
