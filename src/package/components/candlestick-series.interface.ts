import type {
    CandlestickSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap
} from 'lightweight-charts';
import type {Reference} from '../types';

export interface $$PROPS extends CandlestickSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Candlestick'>>;
    data: SeriesDataItemTypeMap['Candlestick'][];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
