import type {
    LineSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap
} from 'lightweight-charts';
import type {Reference} from '../internal/utils';

export interface $$PROPS extends LineSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Line'>>;
    data: SeriesDataItemTypeMap['Line'][];
    reactive?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
