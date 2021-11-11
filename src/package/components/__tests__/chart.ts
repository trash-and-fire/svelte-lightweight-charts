import type {ChartActionParams} from '../../index';
import {describe, it, expect, jest, beforeEach} from '@jest/globals';
import {tick} from 'svelte';

jest.unstable_mockModule('lightweight-charts', async () => ({}));
jest.unstable_mockModule('../..', async () => ({ chart: CHART_ACTION }));

const CHART_ACTION_OBJECT = {
    update: jest.fn<unknown, [ChartActionParams<[]>]>(),
    destroy: jest.fn(),
};

const CHART_ACTION = jest.fn<unknown, [HTMLElement, ChartActionParams<[]>]>(() => CHART_ACTION_OBJECT);

describe('Chart component', () => {
    beforeEach(() => {
       jest.clearAllMocks();
    });

    it('should mount', async () => {
        const { default: Chart } = await import('../chart.svelte');

        new Chart({
            target: document.createElement('div'),
            props: {
                width: 100,
                height: 100,
            },
        });

        await tick();

        expect(CHART_ACTION).toHaveBeenCalledTimes(1);

        const [[element, params]] = CHART_ACTION.mock.calls;
        expect(element).toBeInstanceOf(HTMLElement);
        expect(params.options).toEqual({
            width: 100,
            height: 100,
        });
        expect(typeof params.onCrosshairMove).toBe('function');
        expect(typeof params.onClick).toBe('function');
        expect(typeof params.reference).toBe('function');
    });

    it('should update', async () => {
        const { default: Chart } = await import('../chart.svelte');

        const component = new Chart({
            target: document.createElement('div'),
            props: {
                width: 100,
                height: 100,
            },
        });

        await tick();

        component.$set({
            width: 100,
            height: 100,
            layout: {
                backgroundColor: '#FFFFFF',
                textColor: '#FFFFFF',
                fontSize: 14,
                fontFamily: 'Arial',
            }
        })

        await tick();

        expect(CHART_ACTION_OBJECT.update).toHaveBeenCalledTimes(1);

        const [[params]] = CHART_ACTION_OBJECT.update.mock.calls;
        expect(params.options).toEqual({
            width: 100,
            height: 100,
            layout: {
                backgroundColor: '#FFFFFF',
                textColor: '#FFFFFF',
                fontSize: 14,
                fontFamily: 'Arial',
            }
        });
    });

    it('should destroy', async () => {
        const { default: Chart } = await import('../chart.svelte');

        const component = new Chart({
            target: document.createElement('div'),
            props: {
                width: 100,
                height: 100,
            },
        });

        await tick();

        component.$destroy();

        await tick();

        expect(CHART_ACTION_OBJECT.destroy).toHaveBeenCalledTimes(1);
    });
})
