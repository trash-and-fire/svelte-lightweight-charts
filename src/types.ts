import type {
    AreaSeriesPartialOptions,
    BarSeriesPartialOptions,
    CandlestickSeriesPartialOptions,
    HistogramSeriesPartialOptions,
    ISeriesApi,
    LineData,
    LineSeriesPartialOptions,
    WhitespaceData
} from 'lightweight-charts';

export interface AreaSeriesProps {
    id: string;
    type: 'Area';
    options?: AreaSeriesPartialOptions;
    data: (LineData | WhitespaceData)[];
    reference?: (api: ISeriesApi<'Area'> | null) => void;
}

export interface BarSeriesProps {
    id: string;
    type: 'Bar';
    options?: BarSeriesPartialOptions;
    data: (LineData | WhitespaceData)[];
    reference?: (api: ISeriesApi<'Bar'> | null) => void;
}

export interface CandlestickSeriesProps {
    id: string;
    type: 'Candlestick';
    options?: CandlestickSeriesPartialOptions;
    data: (LineData | WhitespaceData)[];
    reference?: (api: ISeriesApi<'Candlestick'> | null) => void;
}

export interface HistogramSeriesProps {
    id: string;
    type: 'Histogram';
    options?: HistogramSeriesPartialOptions;
    data: (LineData | WhitespaceData)[];
    reference?: (api: ISeriesApi<'Histogram'> | null) => void;
}

export interface LineSeriesProps {
    id: string;
    type: 'Line';
    options?: LineSeriesPartialOptions;
    data: (LineData | WhitespaceData)[];
    reference?: (api: ISeriesApi<'Line'> | null) => void;
}

export type SeriesProps =
    | AreaSeriesProps
    | BarSeriesProps
    | CandlestickSeriesProps
    | HistogramSeriesProps
    | LineSeriesProps
