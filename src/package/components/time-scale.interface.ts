import type {
    ITimeScaleApi,
    Time,
    Range,
    LogicalRange,
    DeepPartial,
    TimeScaleOptions,
} from 'lightweight-charts';
import type {Reference} from '../internal/utils.js';

export interface $$PROPS extends DeepPartial<TimeScaleOptions> {
    ref?: Reference<ITimeScaleApi<Time>>;
}

export interface $$EVENTS_DETAIL {
    visibleTimeRangeChange: Range<Time> | null;
    visibleLogicalRangeChange: LogicalRange | null;
    sizeChange: { width: number; height: number };
}

export type $$EVENTS = { [K in keyof $$EVENTS_DETAIL]: CustomEvent<$$EVENTS_DETAIL[K]> & { type: K } };
