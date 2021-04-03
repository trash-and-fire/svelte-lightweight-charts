import type {
    ISeriesApi, PriceLineOptions,
    SeriesDataItemTypeMap,
    SeriesPartialOptionsMap,
    SeriesType
} from 'lightweight-charts';

export interface ActionResult<T> {
    update(params: T): void;
    destroy(): void;
}

export type Action<TTarget extends Element, TParams> = (target: TTarget, params: TParams) => ActionResult<TParams>

export interface AreaSeriesParams {
    id: string;
    type: 'Area';
    options?: SeriesPartialOptionsMap['Area'];
    data: SeriesDataItemTypeMap['Area'][];
    reference?: Reference<ISeriesApi<'Area'>>;
    priceLines?: PriceLineOptions[];
}

export interface BarSeriesParams {
    id: string;
    type: 'Bar';
    options?: SeriesPartialOptionsMap['Bar'];
    data: SeriesDataItemTypeMap['Bar'][];
    reference?: Reference<ISeriesApi<'Bar'>>;
    priceLines?: PriceLineOptions[];
}

export interface CandlestickSeriesParams {
    id: string;
    type: 'Candlestick';
    options?: SeriesPartialOptionsMap['Candlestick'];
    data: SeriesDataItemTypeMap['Candlestick'][];
    reference?: Reference<ISeriesApi<'Candlestick'>>;
    priceLines?: PriceLineOptions[];
}

export interface HistogramSeriesParams {
    id: string;
    type: 'Histogram';
    options?: SeriesPartialOptionsMap['Histogram'];
    data: SeriesDataItemTypeMap['Histogram'][];
    reference?: Reference<ISeriesApi<'Histogram'>>;
    priceLines?: PriceLineOptions[];
}

export interface LineSeriesParams {
    id: string;
    type: 'Line';
    options?: SeriesPartialOptionsMap['Line'];
    data: SeriesDataItemTypeMap['Line'][];
    reference?: Reference<ISeriesApi<'Line'>>;
    priceLines?: PriceLineOptions[];
}

export type SeriesActionParams =
    | AreaSeriesParams
    | BarSeriesParams
    | CandlestickSeriesParams
    | HistogramSeriesParams
    | LineSeriesParams

export interface SeriesParamsMap extends Record<SeriesType, unknown> {
    Area: AreaSeriesParams;
    Bar: BarSeriesParams;
    Candlestick: CandlestickSeriesParams;
    Histogram: HistogramSeriesParams;
    Line: LineSeriesParams;
}

export type Reference<T> = (ref: T | null) => void;
