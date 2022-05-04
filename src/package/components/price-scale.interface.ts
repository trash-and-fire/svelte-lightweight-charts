import type {
    DeepPartial,
    IPriceScaleApi,
    PriceScaleOptions,
} from 'lightweight-charts';
import type {Reference} from '../internal/utils';

export interface $$PROPS extends DeepPartial<PriceScaleOptions> {
    id: string;
    ref?: Reference<IPriceScaleApi>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS_DETAIL {

}

export type $$EVENTS = { [K in keyof $$EVENTS_DETAIL]: CustomEvent<$$EVENTS_DETAIL[K]> & { type: K } };
