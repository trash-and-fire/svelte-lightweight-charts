import type {IChartApi, IPriceLine, ISeriesApi, SeriesType} from 'lightweight-charts';
import type {PriceLineParams, Reference} from '../../types';
import type {PriceLineActionResult} from '../../internal/lines';

import {afterUpdate, getContext, onMount, setContext} from 'svelte';
import {series, SeriesActionResult, SeriesParams} from '../../internal/series';
import {line} from '../../internal/lines';

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
    });
}

export function useLineEffect(callback: () => [params: PriceLineParams, ref?: Reference<IPriceLine>]): void {
    let subject: PriceLineActionResult | null = null;

    const api = context<ISeriesApi<SeriesType>>();

    onMount(() => {
        const [params] = callback();
        subject = line(api, params);

        return () => {
            subject?.destroy();
            subject = null;
        }
    });

    afterUpdate(() => {
        const [params, ref] = callback();
        subject?.update(params);
        subject?.updateReference(ref);
    });
}
