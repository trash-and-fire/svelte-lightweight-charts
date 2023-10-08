import type {
    CustomData,
    CustomSeriesOptions,
    ICustomSeriesPaneView,
    ISeriesApi,
    SeriesMarker,
    SeriesPartialOptions,
    Time,
    WhitespaceData,
} from 'lightweight-charts';
import type {Reference} from '../internal/utils.js';

export interface $$PROPS<
    TData extends CustomData<Time> = CustomData<Time>,
    TOptions extends CustomSeriesOptions = CustomSeriesOptions,
    TPartialOptions extends SeriesPartialOptions<TOptions> = SeriesPartialOptions<TOptions>
> {
    view: ICustomSeriesPaneView<Time, TData, TOptions>;
    options: TPartialOptions;
    ref?: Reference<ISeriesApi<"Custom", Time, TData | WhitespaceData<Time>, TOptions, TPartialOptions>>;
    data: (TData | WhitespaceData<Time>)[];
    reactive?: boolean;
    markers?: SeriesMarker<Time>[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
