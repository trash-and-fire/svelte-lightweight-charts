import type {IChartApi} from 'lightweight-charts';
import {getContext, setContext} from 'svelte';

export type Context = IChartApi;

export function context(value: Context): void;
export function context(): Context;
export function context(value?: Context): Context | void {
    if (typeof value !== 'undefined') {
        setContext('lightweight-chart-context', value);
    } else {
        return getContext<Context>('lightweight-chart-context');
    }
}
