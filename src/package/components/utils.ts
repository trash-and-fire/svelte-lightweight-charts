import type {IChartApi, ISeriesApi, SeriesType} from 'lightweight-charts';
import {getContext, setContext} from 'svelte';

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
