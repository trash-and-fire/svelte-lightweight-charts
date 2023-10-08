import type {
    IChartApi,
    ISeriesApi,
    SeriesType,
    SeriesDataItemTypeMap,
    SeriesPartialOptionsMap,
    SeriesOptionsMap,
    SeriesMarker,
    Time,
    ICustomSeriesPaneView,
} from 'lightweight-charts';
import type {ReferencableActionResult, Reference} from './utils.js';

export interface AreaSeriesParams {
    id: string;
    type: 'Area';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Area'];
    data: SeriesDataItemTypeMap['Area'][];
    markers: SeriesMarker<Time>[];
    reference?: Reference<ISeriesApi<'Area'>>;
}

export interface BarSeriesParams {
    id: string;
    type: 'Bar';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Bar'];
    data: SeriesDataItemTypeMap['Bar'][];
    markers: SeriesMarker<Time>[];
    reference?: Reference<ISeriesApi<'Bar'>>;
}

export interface CandlestickSeriesParams {
    id: string;
    type: 'Candlestick';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Candlestick'];
    data: SeriesDataItemTypeMap['Candlestick'][];
    markers: SeriesMarker<Time>[];
    reference?: Reference<ISeriesApi<'Candlestick'>>;
}

export interface HistogramSeriesParams {
    id: string;
    type: 'Histogram';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Histogram'];
    data: SeriesDataItemTypeMap['Histogram'][];
    markers: SeriesMarker<Time>[];
    reference?: Reference<ISeriesApi<'Histogram'>>;
}

export interface LineSeriesParams {
    id: string;
    type: 'Line';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Line'];
    data: SeriesDataItemTypeMap['Line'][];
    markers: SeriesMarker<Time>[];
    reference?: Reference<ISeriesApi<'Line'>>;
}

export type BaselineSeriesParams = 'Baseline' extends SeriesType ? {
    id: string;
    type: 'Baseline';
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Baseline'];
    data: SeriesDataItemTypeMap['Baseline'][];
    markers: SeriesMarker<Time>[];
    reference?: Reference<ISeriesApi<'Baseline'>>;
} : never;

export type CustomSeriesParams = 'Custom' extends SeriesType ? {
    id: string;
    type: 'Custom',
    view: ICustomSeriesPaneView<Time, SeriesDataItemTypeMap['Custom'], SeriesOptionsMap['Custom']>
    reactive?: boolean;
    options?: SeriesPartialOptionsMap['Custom'];
    data: SeriesDataItemTypeMap['Custom'][];
    markers: SeriesMarker<Time>[];
    reference?: Reference<ISeriesApi<'Custom'>>;
} : never;

export type SeriesActionParams =
    | AreaSeriesParams
    | BarSeriesParams
    | CandlestickSeriesParams
    | HistogramSeriesParams
    | LineSeriesParams
    | BaselineSeriesParams
    | CustomSeriesParams

export type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

export type SeriesParams = DistributiveOmit<SeriesActionParams, 'reference'>;

export type SeriesActionResult<T extends SeriesParams> = ReferencableActionResult<T, ISeriesApi<T['type']>>;
export type DistributedSeriesApi<T extends { type: SeriesType }> = T extends unknown ? ISeriesApi<T['type']> : never;

export function series<T extends SeriesParams>(target: IChartApi, params: T): SeriesActionResult<T> {
    let subject = createSeries(target, params);
    let reference: Reference<ISeriesApi<SeriesType>>;

    let data = params.reactive ? params.data : null;
    let markers = params.markers;
    let view = params.type === 'Custom' ? params.view : null;

    return {
        update(nextParams: SeriesParams): void {
            if (nextParams.type !== subject.seriesType()) {
                target.removeSeries(subject);
                reference?.(null);
                subject = createSeries(target, nextParams);
                reference?.(subject);
                view = nextParams.type === 'Custom' ? nextParams.view : null;
                return;
            }

            if (nextParams.type === 'Custom' && subject.seriesType() === 'Custom' && nextParams.view !== view) {
                target.removeSeries(subject);
                reference?.(null);
                subject = createSeries(target, nextParams);
                reference?.(subject);
                view = nextParams.view;
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

            if (nextParams.markers !== markers) {
                markers = nextParams.markers;
                subject.setMarkers(markers);
            }
        },
        updateReference(nextReference: Reference<ISeriesApi<SeriesType>>): void {
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


function createSeries(chart: IChartApi, params: SeriesActionParams): DistributedSeriesApi<SeriesActionParams> {
    switch (params.type) {
        case 'Area': {
            const series = chart.addAreaSeries(params.options);
            series.setData(params.data);
            series.setMarkers(params.markers);
            return series;
        }
        case 'Bar': {
            const series = chart.addBarSeries(params.options);
            series.setData(params.data);
            series.setMarkers(params.markers);
            return series;
        }
        case 'Candlestick': {
            const series = chart.addCandlestickSeries(params.options);
            series.setData(params.data);
            series.setMarkers(params.markers);
            return series;
        }
        case 'Histogram': {
            const series = chart.addHistogramSeries(params.options);
            series.setData(params.data);
            series.setMarkers(params.markers);
            return series;
        }
        case 'Line': {
            const series = chart.addLineSeries(params.options);
            series.setData(params.data);
            series.setMarkers(params.markers);
            return series;
        }
        case 'Baseline': {
            const series = chart.addBaselineSeries(params.options);
            series.setData(params.data);
            series.setMarkers(params.markers);
            return series;
        }
        case 'Custom': {
            const series = chart.addCustomSeries(params.view, params.options);
            series.setData(params.data);
            series.setMarkers(params.markers);
            return series;
        }
    }
}
