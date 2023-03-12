import type {
    AreaSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap,
    SeriesMarker,
    Time,
} from 'lightweight-charts';
import type {Reference} from '../internal/utils.js';

export interface $$PROPS extends AreaSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Area'>>;
    data: SeriesDataItemTypeMap['Area'][];
    reactive?: boolean;
    markers?: SeriesMarker<Time>[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
