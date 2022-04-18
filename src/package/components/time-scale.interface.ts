import type {
    ITimeScaleApi,
    TimeRange,
    LogicalRange,
} from 'lightweight-charts';
import type {Reference} from '../types';

export interface $$PROPS {
    ref?: Reference<ITimeScaleApi>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {
    visibleTimeRangeChange?: TimeRange | null;
    visibleLogicalRangeChange?: LogicalRange | null;
    sizeChange?: { width: number; height: number };
}
