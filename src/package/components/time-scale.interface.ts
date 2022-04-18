import type {
    ITimeScaleApi,
    TimeRange,
    LogicalRange,
    DeepPartial,
    TimeScaleOptions,
} from 'lightweight-charts';
import type {Reference} from '../types';

export interface $$PROPS extends DeepPartial<TimeScaleOptions>{
    ref?: Reference<ITimeScaleApi>;
}

export interface $$EVENTS_DETAIL {
    visibleTimeRangeChange: TimeRange | null;
    visibleLogicalRangeChange: LogicalRange | null;
    sizeChange: { width: number; height: number };
}

export type $$EVENTS = { [K in keyof $$EVENTS_DETAIL]: CustomEvent<$$EVENTS_DETAIL[K]> & { type: K } };
