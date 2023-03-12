import type {
    BaselineSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap,
    SeriesMarker,
    Time,
} from 'lightweight-charts';
import type {Reference} from '../internal/utils.js';

export interface $$PROPS extends BaselineSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Baseline'>>;
    data: SeriesDataItemTypeMap['Baseline'][];
    reactive?: boolean;
    markers?: SeriesMarker<Time>[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
