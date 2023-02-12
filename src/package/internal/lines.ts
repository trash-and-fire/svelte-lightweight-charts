import type {IPriceLine, ISeriesApi, SeriesType, CreatePriceLineOptions} from 'lightweight-charts';
import type {ReferencableActionResult, Reference} from './utils.js';

export interface PriceLineParams {
    id: string;
    options: CreatePriceLineOptions;
    reference?: Reference<IPriceLine>;
}

export type PriceLineActionResult = ReferencableActionResult<PriceLineParams, IPriceLine>;

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
