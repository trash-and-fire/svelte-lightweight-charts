import type {
    IPriceLine,
    ISeriesApi,
    ITimeScaleApi,
    LogicalRangeChangeEventHandler,
    PriceLineOptions,
    SeriesDataItemTypeMap,
    SeriesPartialOptionsMap,
    SeriesType,
    SizeChangeEventHandler,
    TimeRangeChangeEventHandler,
} from 'lightweight-charts';

export interface ActionResult<T> {
    update(params: T): void;
    destroy(): void;
}

export interface ReferencableActionResult<P, R> extends ActionResult<P> {
    updateReference(nextReference?: Reference<R>): void;
}

export type Action<TTarget extends Element, TParams> = (target: TTarget, params: TParams) => ActionResult<TParams>

export interface PriceLineParams {
    id: string;
    options: PriceLineOptions;
    reference?: Reference<IPriceLine>;
}

export interface AreaSeriesParams {
    id: string;
    type: 'Area';
    options?: SeriesPartialOptionsMap['Area'];
    data: SeriesDataItemTypeMap['Area'][];
    reference?: Reference<ISeriesApi<'Area'>>;
    priceLines?: PriceLineParams[];
}

export interface BarSeriesParams {
    id: string;
    type: 'Bar';
    options?: SeriesPartialOptionsMap['Bar'];
    data: SeriesDataItemTypeMap['Bar'][];
    reference?: Reference<ISeriesApi<'Bar'>>;
    priceLines?: PriceLineParams[];
}

export interface CandlestickSeriesParams {
    id: string;
    type: 'Candlestick';
    options?: SeriesPartialOptionsMap['Candlestick'];
    data: SeriesDataItemTypeMap['Candlestick'][];
    reference?: Reference<ISeriesApi<'Candlestick'>>;
    priceLines?: PriceLineParams[];
}

export interface HistogramSeriesParams {
    id: string;
    type: 'Histogram';
    options?: SeriesPartialOptionsMap['Histogram'];
    data: SeriesDataItemTypeMap['Histogram'][];
    reference?: Reference<ISeriesApi<'Histogram'>>;
    priceLines?: PriceLineParams[];
}

export interface LineSeriesParams {
    id: string;
    type: 'Line';
    options?: SeriesPartialOptionsMap['Line'];
    data: SeriesDataItemTypeMap['Line'][];
    reference?: Reference<ISeriesApi<'Line'>>;
    priceLines?: PriceLineParams[];
}

export type BaselineSeriesParams = 'Baseline' extends SeriesType ? {
    id: string;
    type: 'Baseline';
    options?: SeriesPartialOptionsMap['Baseline'];
    data: SeriesDataItemTypeMap['Baseline'][];
    reference?: Reference<ISeriesApi<'Baseline'>>;
    priceLines?: PriceLineParams[];
} : never;

export type SeriesActionParams =
    | AreaSeriesParams
    | BarSeriesParams
    | CandlestickSeriesParams
    | HistogramSeriesParams
    | LineSeriesParams
    | BaselineSeriesParams

export interface SeriesParamsMap extends Record<SeriesType, unknown> {
    Area: AreaSeriesParams;
    Bar: BarSeriesParams;
    Candlestick: CandlestickSeriesParams;
    Histogram: HistogramSeriesParams;
    Line: LineSeriesParams;
    Baseline: BaselineSeriesParams;
}

export interface TimeScaleParams {
    reference?: Reference<ITimeScaleApi>;
    onVisibleTimeRangeChange?: TimeRangeChangeEventHandler;
    onVisibleLogicalRangeChange?: LogicalRangeChangeEventHandler;
    onSizeChange?: SizeChangeEventHandler;
}

export type Reference<T> = (ref: T | null) => void;
