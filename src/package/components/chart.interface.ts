import type {ChartOptions, DeepPartial, MouseEventParams} from 'lightweight-charts';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$PROPS extends DeepPartial<ChartOptions> {}

export interface $$EVENTS {
    crosshairMove: MouseEventParams,
    click: MouseEventParams,
}
