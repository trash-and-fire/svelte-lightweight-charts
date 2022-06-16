import {chart} from './internal/server-chart.js';

export {default as Chart} from './components/server-chart.svelte';
export {default as AreaSeries} from './components/area-series.svelte';
export {default as BarSeries} from './components/bar-series.svelte';
export {default as BaselineSeries} from './components/baseline-series.svelte';
export {default as CandlestickSeries} from './components/candlestick-series.svelte';
export {default as HistogramSeries} from './components/histogram-series.svelte';
export {default as LineSeries} from './components/line-series.svelte';
export {default as PriceLine} from './components/price-line.svelte';
export {default as PriceScale} from './components/price-scale.svelte';
export {default as TimeScale} from './components/time-scale.svelte';

/** @deprecated */
export type {ChartActionParams} from './internal/chart.js';
export type {$$PROPS as ChartProps, $$EVENTS as ChartEventArgs, $$EVENTS_DETAIL as ChartEventDetails} from './components/chart.interface.js';
export type {$$PROPS as AreaSeriesProps} from './components/area-series.interface.js';
export type {$$PROPS as BarSeriesProps} from './components/bar-series.interface.js';
export type {$$PROPS as BaselineSeriesProps} from './components/baseline-series.interface.js';
export type {$$PROPS as CandlestickSeriesProps} from './components/candlestick-series.interface.js';
export type {$$PROPS as HistogramSeriesProps} from './components/histogram-series.interface.js';
export type {$$PROPS as LineSeriesProps} from './components/line-series.interface.js';
export type {$$PROPS as PriceLineProps} from './components/price-line.interface.js';
export type {$$PROPS as PriceScaleProps} from './components/price-scale.interface.js';
export type {$$PROPS as TimeScaleProps, $$EVENTS as TimeScaleEventArgs, $$EVENTS_DETAIL as TimeScaleEventDetails} from './components/time-scale.interface.js';
export type {Reference} from './internal/utils.js';

/** @deprecated Use <Chart> component instead */
export {chart};
/** @deprecated Use <Chart> component instead */
export default chart;
