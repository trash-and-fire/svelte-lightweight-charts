import type {
    HistogramSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap,
    SeriesMarker,
    Time,
} from 'lightweight-charts';
import type {Reference} from '../internal/utils.js';

export interface $$PROPS extends HistogramSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Histogram'>>;
    data: SeriesDataItemTypeMap['Histogram'][];
    reactive?: boolean;
    markers?: SeriesMarker<Time>[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
