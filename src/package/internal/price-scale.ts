import type {IChartApi, IPriceScaleApi} from 'lightweight-charts';
import type {Reference, ReferencableActionResult, PriceScaleParams} from '../types';

export type PriceScaleActionResult = ReferencableActionResult<PriceScaleParams, IPriceScaleApi>;

export function priceScale(target: IChartApi, params: PriceScaleParams): PriceScaleActionResult {
    let {
        id,
        options,
    } = params;

    let subject = target.priceScale(id);
    let reference: Reference<IPriceScaleApi>;

    if (options) {
        subject.applyOptions(options);
    }

    return {
        update(nextParams: PriceScaleParams): void {
            const {
                id: nextId,
                options: nextOptions,
            } = nextParams;

            if (nextId !== id) {
                id = nextId;
                reference?.(null);
                subject = target.priceScale(id);
                reference?.(subject);
            }

            if (nextOptions !== options) {
                options = nextOptions;
                if (options) {
                    subject.applyOptions(options);
                }
            }
        },
        updateReference(nextReference: Reference<IPriceScaleApi>): void {
            if (nextReference !== reference) {
                reference?.(null)
                reference = nextReference;
                reference?.(subject);
            }
        },
        destroy(): void {
            reference?.(null);
        }
    };
}
