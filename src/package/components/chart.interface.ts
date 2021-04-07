import type {
    IChartApi,
    ChartOptions,
    DeepPartial,
    MouseEventParams
} from 'lightweight-charts';
import type {Reference} from '../types';

export interface $$PROPS extends DeepPartial<ChartOptions> {
    ref?: Reference<IChartApi>;
}

export interface $$EVENTS {
    crosshairMove: MouseEventParams,
    click: MouseEventParams,
}
