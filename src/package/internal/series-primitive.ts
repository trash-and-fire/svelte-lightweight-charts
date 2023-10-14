import type {ISeriesApi, ISeriesPrimitive, SeriesType, Time} from 'lightweight-charts';
import type {ActionResult} from './utils.js';

export interface SeriesPrimitiveParams<T = Time> {
    view: ISeriesPrimitive<T>;
}

export type SeriesPrimitiveActionResult<T = Time> = ActionResult<SeriesPrimitiveParams<T>>;

export function seriesPrimitive<S extends SeriesType, T = Time>(
    target: ISeriesApi<S, T>,
    params: SeriesPrimitiveParams<T>
): SeriesPrimitiveActionResult<T> {
    let { view } = params;
    target.attachPrimitive(view);

    return {
        update(nextParams: SeriesPrimitiveParams<T>): void {
            if (nextParams.view !== view) {
                target.detachPrimitive(view);
                view = nextParams.view;
                target.attachPrimitive(view);
            }
        },
        destroy(): void {
            target.detachPrimitive(view);
        }
    };
}
