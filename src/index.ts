import {
    ChartOptions,
    createChart,
    DeepPartial,
    IChartApi,
    ISeriesApi, SeriesType,
} from 'lightweight-charts';
import type {SeriesProps} from './types';

export interface ChartProps<T extends Array<SeriesProps>> {
    options?: DeepPartial<ChartOptions>;
    series?: T;
    reference?: (api: IChartApi | null) => void;
}

export interface ChartActionResult<T extends Array<SeriesProps>> {
    update(props: ChartProps<T>): void;

    destroy(): void;
}

export function chart<T extends Array<SeriesProps>>(node: HTMLElement, props: ChartProps<T>): ChartActionResult<T> {
    const {series} = props;

    let {options, reference} = props;
    let width = options?.width ?? 0;
    let height = options?.height ?? 0;

    const chart = createChart(node, options);
    const apis = new Map<string, ISeriesApi<SeriesType>>();

    if (series !== undefined) {
        for (const current of series) {
            const api = createSeries(chart, current);
            apis.set(current.id, api);
        }
    }

    reference?.(chart);

    return {
        update(nextProps: ChartProps<T>): void {
            const {options: nextOptions, reference: nextReference, series: nextSeries} = nextProps;

            if (nextReference !== reference) {
                reference?.(null);
                reference = nextReference;
                reference?.(chart);
            }

            if (nextOptions) {
                chart.applyOptions(nextOptions);

                if (nextOptions.width !== undefined && nextOptions.width !== width
                    || nextOptions.height !== undefined && nextOptions.height !== height
                ) {
                    width = nextOptions.width ?? width;
                    height = nextOptions.height ?? height;
                    chart.resize(width, height, true);
                }

                options = nextOptions;
            }

            if (nextSeries) {
                migrateSeries(chart, apis, nextSeries);
            }
        },
        destroy(): void {
            for (const current of apis.values()) {
                chart.removeSeries(current);
            }
            chart.remove();
        }
    }
}

function createSeries<T extends SeriesProps>(api: IChartApi, props: SeriesProps): ISeriesApi<T['type']> {
    switch (props.type) {
        case 'Area': {
            const series = api.addAreaSeries(props.options);
            series.setData(props.data);
            props.reference?.(series);
            return series;
        }
        case 'Bar': {
            const series = api.addBarSeries(props.options);
            series.setData(props.data);
            props.reference?.(series);
            return series;
        }
        case 'Candlestick': {
            const series = api.addCandlestickSeries(props.options);
            series.setData(props.data);
            props.reference?.(series);
            return series;
        }
        case 'Histogram': {
            const series = api.addHistogramSeries(props.options);
            series.setData(props.data);
            props.reference?.(series);
            return series;
        }
        case 'Line': {
            const series = api.addLineSeries(props.options);
            series.setData(props.data);
            props.reference?.(series);
            return series;
        }
    }
}

// TODO: data and other complex things should also be migrated
function migrateSeries(chart: IChartApi, map: Map<string, ISeriesApi<SeriesType>>, props: SeriesProps[]): void {
    const existing = new Set(map.keys());
    const next = new Map(props.map((item: SeriesProps) => [item.id, item]));

    for (const id of existing) {
        if (!next.has(id)) {
            chart.removeSeries(ensure(map.get(id)));
            map.delete(id);
        }
    }

    for (const [id, entry] of next.entries()) {
        let api = map.get(id);
        if (api === undefined) {
            api = createSeries(chart, entry);
            map.set(id, api);
        } else {
            if (entry.type !== api.seriesType()) {
                chart.removeSeries(api);
                api = createSeries(chart, entry);
                map.set(id, api);
            } else {
                // TODO: strictly compare series and props types (logically it is already the same)
                // TODO: change eslint ban types rule
                // if (entry.options) {
                //     api.applyOptions(entry.options as Record<string, never>);
                // }
            }
        }
    }
}

function ensure<T>(value: T | null | undefined): T {
    if (value === null || value === undefined) {
        throw new Error('no value');
    }
    return value;
}
