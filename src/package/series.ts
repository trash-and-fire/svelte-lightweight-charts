import type {IChartApi, ISeriesApi} from 'lightweight-charts';
import type {ActionResult, Reference, SeriesActionParams} from './types';
import {ensure} from './utils';

export type SeriesParams = Omit<SeriesActionParams, 'reference'>;

export interface SeriesActionResult<T extends SeriesParams> extends ActionResult<T> {
    updateReference(nextReference?: Reference<ISeriesApi<T['type']>>): void;
}

export function seriesCollection(target: IChartApi, params: SeriesActionParams[] = []): ActionResult<SeriesActionParams[] | undefined> {
    const collection = new Map<string, SeriesActionResult<SeriesActionParams>>();
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
                    const created = series(target, options);
                    created.updateReference(options.reference as never);
                    collection.set(id, created);
                } else {
                    entry.update(options);
                    entry.updateReference(options.reference as never);
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

export function series<T extends SeriesParams>(target: IChartApi, params: T): SeriesActionResult<T> {
    let subject = createSeries(target, params);
    let reference: Reference<ISeriesApi<T['type']>>;

    return {
        update(nextParams: SeriesParams): void {
            if (nextParams.type !== subject.seriesType()) {
                target.removeSeries(subject);
                subject = createSeries(target, nextParams);
                return;
            }

            if (nextParams.options) {
                subject.applyOptions(nextParams.options);
            }
        },
        updateReference(nextReference: Reference<ISeriesApi<T['type']>>): void {
            if (nextReference !== reference) {
                reference?.(null)
                reference = nextReference;
                // TODO: think about reference covariance
                reference?.(subject as never);
            }
        },
        destroy(): void {
            reference?.(null);
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
            return series;
        }
        case 'Bar': {
            const series = chart.addBarSeries(params.options);
            series.setData(params.data);
            return series;
        }
        case 'Candlestick': {
            const series = chart.addCandlestickSeries(params.options);
            series.setData(params.data);
            return series;
        }
        case 'Histogram': {
            const series = chart.addHistogramSeries(params.options);
            series.setData(params.data);
            return series;
        }
        case 'Line': {
            const series = chart.addLineSeries(params.options);
            series.setData(params.data);
            return series;
        }
    }
}
