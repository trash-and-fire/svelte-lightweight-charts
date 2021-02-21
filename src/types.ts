import type {
    ISeriesApi,
    SeriesDataItemTypeMap,
    SeriesPartialOptionsMap, SeriesType
} from 'lightweight-charts';

export interface AreaSeriesProps {
    id: string;
    type: 'Area';
    options?: SeriesPartialOptionsMap['Area'];
    data: SeriesDataItemTypeMap['Area'][];
    reference?: (api: ISeriesApi<'Area'> | null) => void;
}

export interface BarSeriesProps {
    id: string;
    type: 'Bar';
    options?: SeriesPartialOptionsMap['Bar'];
    data: SeriesDataItemTypeMap['Bar'][];
    reference?: (api: ISeriesApi<'Bar'> | null) => void;
}

export interface CandlestickSeriesProps {
    id: string;
    type: 'Candlestick';
    options?: SeriesPartialOptionsMap['Candlestick'];
    data: SeriesDataItemTypeMap['Candlestick'][];
    reference?: (api: ISeriesApi<'Candlestick'> | null) => void;
}

export interface HistogramSeriesProps {
    id: string;
    type: 'Histogram';
    options?: SeriesPartialOptionsMap['Histogram'];
    data: SeriesDataItemTypeMap['Histogram'][];
    reference?: (api: ISeriesApi<'Histogram'> | null) => void;
}

export interface LineSeriesProps {
    id: string;
    type: 'Line';
    options?: SeriesPartialOptionsMap['Line'];
    data: SeriesDataItemTypeMap['Line'][];
    reference?: (api: ISeriesApi<'Line'> | null) => void;
}

export type SeriesProps =
    | AreaSeriesProps
    | BarSeriesProps
    | CandlestickSeriesProps
    | HistogramSeriesProps
    | LineSeriesProps

export interface SeriesPropsMap extends Record<SeriesType, unknown> {
    Area: AreaSeriesProps;
    Bar: BarSeriesProps;
    Candlestick: CandlestickSeriesProps;
    Histogram: HistogramSeriesProps;
    Line: LineSeriesProps;
}
