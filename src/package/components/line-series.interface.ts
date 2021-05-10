import type {
    LineSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap
} from 'lightweight-charts';
import type {Reference} from '../types';

export interface $$PROPS extends LineSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Line'>>;
    data: SeriesDataItemTypeMap['Line'][];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
