import type {
    BaselineSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap
} from 'lightweight-charts';
import type {Reference} from '../types';

export interface $$PROPS extends BaselineSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Baseline'>>;
    data: SeriesDataItemTypeMap['Baseline'][];
    reactive?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
