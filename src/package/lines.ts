import type {IPriceLine, ISeriesApi, SeriesType} from 'lightweight-charts';
import type {ActionResult, Reference, PriceLineParams, ReferencableActionResult} from './types';
import {collection} from './collection';

export type PriceLineActionResult = ReferencableActionResult<PriceLineParams, IPriceLine>;

export function linesCollection<T extends SeriesType>(
    target: ISeriesApi<T>,
    params: PriceLineParams[] = []
): ActionResult<PriceLineParams[] | undefined> {
    return collection(target, params, line, (p: PriceLineParams) => p.reference);
}

export function line<T extends SeriesType>(
    target: ISeriesApi<T>,
    params: PriceLineParams
): PriceLineActionResult {
    const subject = target.createPriceLine(params.options);
    let reference: Reference<IPriceLine>;

    return {
        update(nextParams: PriceLineParams): void {
            if (nextParams.options) {
                subject.applyOptions(nextParams.options);
            }
        },
        updateReference(nextReference: Reference<IPriceLine>): void {
            if (nextReference !== reference) {
                reference?.(null)
                reference = nextReference;
                reference?.(subject);
            }
        },
        destroy(): void {
            reference?.(null);
            target.removePriceLine(subject);
        }
    };
}
