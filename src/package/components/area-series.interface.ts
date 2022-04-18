import type {
    AreaSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap
} from 'lightweight-charts';
import type {Reference} from '../types';

export interface $$PROPS extends AreaSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Area'>>;
    data: SeriesDataItemTypeMap['Area'][];
    reactive?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
