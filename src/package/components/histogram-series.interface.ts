import type {
    HistogramSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap
} from 'lightweight-charts';
import type {Reference} from '../types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$PROPS extends HistogramSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Histogram'>>;
    data: SeriesDataItemTypeMap['Histogram'][];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
