import type {IChartApi, ISeriesApi} from 'lightweight-charts';
import type {ActionResult, SeriesActionParams} from './types';
import {ensure} from './utils';

export function seriesCollection(target: IChartApi, params: SeriesActionParams[] = []): ActionResult<SeriesActionParams[] | undefined> {
    const collection = new Map<string, ActionResult<SeriesActionParams>>();
    for (const current of params) {
        collection.set(current.id, series(target, current));
    }

    return {
        update(nextParams: SeriesActionParams[] = []): void {
            const existing = new Set(collection.keys());
            const next = new Map(nextParams.map((item: SeriesActionParams) => [item.id, item]));

            for (const id of existing) {
                if (!next.has(id)) {
                    const entry = ensure(collection.get(id))
                    entry.destroy();

                    collection.delete(id);
                }
            }

            for (const [id, options] of next.entries()) {
                const entry = collection.get(id);
                if (entry === undefined) {
                    collection.set(id, series(target, options));
                } else {
                    entry.update(options);
                }
            }
        },
        destroy() {
            for (const current of collection.values()) {
                current.destroy();
            }
        }
    }
}

export function series<T extends SeriesActionParams>(target: IChartApi, params: T): ActionResult<T> {
    let subject = createSeries(target, params);
    let {reference} = params;

    return {
        update(nextParams: SeriesActionParams): void {
            if (nextParams.type !== subject.seriesType()) {
                target.removeSeries(subject);
                subject = createSeries(target, nextParams);
                return;
            }

            if (nextParams.options) {
                subject.applyOptions(nextParams.options);
            }

            if (nextParams.reference !== reference) {
                reference?.(null)
                reference = nextParams.reference;
                // TODO: think about reference covariance
                reference?.(subject as never);
            }
        },
        destroy(): void {
            params.reference?.(null);
            target.removeSeries(subject);
        }
    };
}

function createSeries<T extends SeriesActionParams>(
    chart: IChartApi,
    params: SeriesActionParams
): ISeriesApi<T['type']> {
    switch (params.type) {
        case 'Area': {
            const series = chart.addAreaSeries(params.options);
            series.setData(params.data);
            params.reference?.(series);
            return series;
        }
        case 'Bar': {
            const series = chart.addBarSeries(params.options);
            series.setData(params.data);
            params.reference?.(series);
            return series;
        }
        case 'Candlestick': {
            const series = chart.addCandlestickSeries(params.options);
            series.setData(params.data);
            params.reference?.(series);
            return series;
        }
        case 'Histogram': {
            const series = chart.addHistogramSeries(params.options);
            series.setData(params.data);
            params.reference?.(series);
            return series;
        }
        case 'Line': {
            const series = chart.addLineSeries(params.options);
            series.setData(params.data);
            params.reference?.(series);
            return series;
        }
    }
}
