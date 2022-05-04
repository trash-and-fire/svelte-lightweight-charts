import type {
    HistogramSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap
} from 'lightweight-charts';
import type {Reference} from '../internal/utils';

export interface $$PROPS extends HistogramSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Histogram'>>;
    data: SeriesDataItemTypeMap['Histogram'][];
    reactive?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
