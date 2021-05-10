import type {
    BarSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap
} from 'lightweight-charts';
import type {Reference} from '../types';

export interface $$PROPS extends BarSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Bar'>>;
    data: SeriesDataItemTypeMap['Bar'][];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
