import type {ISeriesPrimitive, ISeriesApi, SeriesType, Time} from 'lightweight-charts';
import type {ActionResult} from './utils.js';

export interface IReactiveSeriesPrimitive<O, T = Time> extends ISeriesPrimitive<T> {
    applyOptions(options: O): void;
}

export interface SeriesPrimitiveParams<O, T = Time> {
    view: IReactiveSeriesPrimitive<O, T>;
    options: O;
}

export type SeriesPrimitiveActionResult<O, T = Time> = ActionResult<SeriesPrimitiveParams<O, T>>;

export function seriesPrimitive<O, S extends SeriesType, T = Time>(
    target: ISeriesApi<S, T>,
    params: SeriesPrimitiveParams<O, T>
): SeriesPrimitiveActionResult<O, T> {
    let { view, options } = params;

    view.applyOptions(options);
    target.attachPrimitive(view);

    return {
        update(nextParams: SeriesPrimitiveParams<O, T>): void {
            if (nextParams.view !== view) {
                target.detachPrimitive(view);
                view = nextParams.view;
                options = nextParams.options;
                view.applyOptions(options);
                target.attachPrimitive(view);
            } else {
                options = nextParams.options;
                view.applyOptions(options);
            }
        },
        destroy(): void {
            target.detachPrimitive(view);
        }
    };
}
