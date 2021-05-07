import type {IChartApi, ISeriesApi, SeriesType} from 'lightweight-charts';
import type {Reference} from '../types';

import {afterUpdate, getContext, onMount, setContext} from 'svelte';
import {series, SeriesActionResult, SeriesParams} from '../series';

export type Context = IChartApi | ISeriesApi<SeriesType>;

export function context<T extends Context>(value: T): void;
export function context<T extends Context>(): T;
export function context<T extends Context>(value?: T): T | void {
    if (typeof value !== 'undefined') {
        setContext('lightweight-chart-context', value);
    } else {
        return getContext<T>('lightweight-chart-context');
    }
}

export function useSeriesEffect<T extends SeriesParams>(callback: () => [params: T, ref?: Reference<ISeriesApi<T['type']>>]): void {
    let subject: SeriesActionResult<T> | null = null;

    const api = context<IChartApi>();

    onMount(() => {
        const [params] = callback();
        subject = series(api, params);

        return () => {
            subject?.destroy();
            subject = null;
        }
    });

    afterUpdate(() => {
        const [params, ref] = callback();
        subject?.update(params);
        subject?.updateReference(ref);
    })
}
