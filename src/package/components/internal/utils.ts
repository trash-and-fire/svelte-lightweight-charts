import type {IChartApi, IPriceLine, IPriceScaleApi, ISeriesApi, ITimeScaleApi, SeriesType, Time} from 'lightweight-charts';
import type {PriceLineActionResult, PriceLineParams} from '../../internal/lines';
import type {Reference} from '../../internal/utils.js';
import type {PriceScaleActionResult, PriceScaleParams} from '../../internal/price-scale';
import type {TimeScaleActionResult, TimeScaleParams} from '../../internal/time-scale';

import {afterUpdate, getContext, onMount, setContext} from 'svelte';
import {series, SeriesActionResult, SeriesParams} from '../../internal/series.js';
import {line} from '../../internal/lines.js';
import {timeScale} from '../../internal/time-scale.js';
import {priceScale} from '../../internal/price-scale.js';

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

export function useSeriesEffect<T extends SeriesParams>(callback: () => [params: T, ref: Reference<ISeriesApi<T['type']>> | undefined]): void {
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

export function useLineEffect(callback: () => [params: PriceLineParams, ref: Reference<IPriceLine> | undefined]): void {
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

export function useTimeScaleEffect(callback: () => [params: TimeScaleParams, ref: Reference<ITimeScaleApi<Time>> | undefined]): void {
    let subject: TimeScaleActionResult | null = null;

    const api = context<IChartApi>();

    onMount(() => {
        const [params] = callback();
        subject = timeScale(api, params);

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

export function usePriceScaleEffect(callback: () => [params: PriceScaleParams, ref: Reference<IPriceScaleApi> | undefined]): void {
    let subject: PriceScaleActionResult | null = null;

    const api = context<IChartApi>();

    onMount(() => {
        const [params] = callback();
        subject = priceScale(api, params);

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
