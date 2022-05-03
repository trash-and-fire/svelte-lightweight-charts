import type {
    BarSeriesPartialOptions,
    ISeriesApi,
    SeriesDataItemTypeMap
} from 'lightweight-charts';
import type {Reference} from "../internal/utils";

export interface $$PROPS extends BarSeriesPartialOptions {
    ref?: Reference<ISeriesApi<'Bar'>>;
    data: SeriesDataItemTypeMap['Bar'][];
    reactive?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
