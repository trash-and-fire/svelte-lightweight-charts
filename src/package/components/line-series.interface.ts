import type {
    LineSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap,
    SeriesMarker,
    Time
} from 'lightweight-charts';
import type {Reference} from '../internal/utils.js';

export interface $$PROPS extends LineSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Line'>>;
    data: SeriesDataItemTypeMap['Line'][];
    reactive?: boolean;
    markers?: SeriesMarker<Time>[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
