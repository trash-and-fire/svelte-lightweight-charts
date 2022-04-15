import type {
    IChartApi,
    ChartOptions,
    DeepPartial,
    MouseEventParams
} from 'lightweight-charts';
import type {Reference} from '../types';

export interface $$PROPS extends DeepPartial<ChartOptions> {
    ref?: Reference<IChartApi>;
    container?: {
        ref?: Reference<HTMLElement>;
        class?: string;
        id?: string;
    }
}

export interface $$EVENTS {
    crosshairMove: MouseEventParams,
    click: MouseEventParams,
}
