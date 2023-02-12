import type {IChartApi, ISeriesApi, SeriesType, SeriesDataItemTypeMap, SeriesPartialOptionsMap} from 'lightweight-charts';
import type {ReferencableActionResult, Reference} from './utils.js';

export interface AreaSeriesParams {
    id: string;
    type: 'Area';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Area'];
    data: SeriesDataItemTypeMap['Area'][];
    reference?: Reference<ISeriesApi<'Area'>>;
}

export interface BarSeriesParams {
    id: string;
    type: 'Bar';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Bar'];
    data: SeriesDataItemTypeMap['Bar'][];
    reference?: Reference<ISeriesApi<'Bar'>>;
}

export interface CandlestickSeriesParams {
    id: string;
    type: 'Candlestick';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Candlestick'];
    data: SeriesDataItemTypeMap['Candlestick'][];
    reference?: Reference<ISeriesApi<'Candlestick'>>;
}

export interface HistogramSeriesParams {
    id: string;
    type: 'Histogram';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Histogram'];
    data: SeriesDataItemTypeMap['Histogram'][];
    reference?: Reference<ISeriesApi<'Histogram'>>;
}

export interface LineSeriesParams {
    id: string;
    type: 'Line';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Line'];
    data: SeriesDataItemTypeMap['Line'][];
    reference?: Reference<ISeriesApi<'Line'>>;
}

export type BaselineSeriesParams = 'Baseline' extends SeriesType ? {
    id: string;
    type: 'Baseline';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Baseline'];
    data: SeriesDataItemTypeMap['Baseline'][];
    reference?: Reference<ISeriesApi<'Baseline'>>;
} : never;

export type SeriesActionParams =
    | AreaSeriesParams
    | BarSeriesParams
    | CandlestickSeriesParams
    | HistogramSeriesParams
    | LineSeriesParams
    | BaselineSeriesParams

export type SeriesParams = Omit<SeriesActionParams, 'reference'>;

export type SeriesActionResult<T extends SeriesParams> = ReferencableActionResult<T, ISeriesApi<T['type']>>;

export function series<T extends SeriesParams>(target: IChartApi, params: T): SeriesActionResult<T> {
    let subject = createSeries(target, params);
    let reference: Reference<ISeriesApi<SeriesType>>;

    let data = params.reactive ? params.data : null;

    return {
        update(nextParams: SeriesParams): void {
            if (nextParams.type !== subject.seriesType()) {
                target.removeSeries(subject);
                reference?.(null);
                subject = createSeries(target, nextParams);
                reference?.(subject);
                return;
            }

            if (nextParams.options) {
                subject.applyOptions(nextParams.options);
            }

            if (!nextParams.reactive) {
                data = null;
            }

            if (nextParams.data !== data && nextParams.reactive) {
                data = nextParams.data;
                subject.setData(data);
            }
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
        case 'Baseline': {
            const series = chart.addBaselineSeries(params.options);
            series.setData(params.data);
            return series;
        }
    }
}
