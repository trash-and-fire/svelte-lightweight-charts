import type {
    BarSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap,
    SeriesMarker,
    Time,
} from 'lightweight-charts';
import type {Reference} from '../internal/utils.js';

export interface $$PROPS extends BarSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Bar'>>;
    data: SeriesDataItemTypeMap['Bar'][];
    reactive?: boolean;
    markers?: SeriesMarker<Time>[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
