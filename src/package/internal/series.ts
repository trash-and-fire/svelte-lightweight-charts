import type {IChartApi, ISeriesApi, SeriesType} from 'lightweight-charts';
import type {ActionResult, ReferencableActionResult, Reference, SeriesActionParams} from '../types';
import {collection} from './collection';
import {linesCollection} from './lines';

export type SeriesParams = Omit<SeriesActionParams, 'reference'>;

export type SeriesActionResult<T extends SeriesParams> = ReferencableActionResult<T, ISeriesApi<T['type']>>;

export function seriesCollection(target: IChartApi, params: SeriesActionParams[] = []): ActionResult<SeriesActionParams[] | undefined> {
    return collection(
        target,
        params,
        series,
        (p: SeriesActionParams) => p.reference as Reference<ISeriesApi<SeriesType>>
    );
}

export function series<T extends SeriesParams>(target: IChartApi, params: T): SeriesActionResult<T> {
    let subject = createSeries(target, params);
    let reference: Reference<ISeriesApi<SeriesType>>;

    let lines = linesCollection(subject, params.priceLines);

    return {
        update(nextParams: SeriesParams): void {
            if (nextParams.type !== subject.seriesType()) {
                lines.destroy();
                target.removeSeries(subject);
                // TODO: where is reference update?
                subject = createSeries(target, nextParams);
                lines = linesCollection(subject, params.priceLines);
                return;
            }

            if (nextParams.options) {
                subject.applyOptions(nextParams.options);
            }

            lines.update(nextParams.priceLines);
        },
        updateReference(nextReference: Reference<ISeriesApi<T['type']>>): void {
            if (nextReference !== reference) {
                reference?.(null)
                reference = nextReference;
                reference?.(subject);
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
