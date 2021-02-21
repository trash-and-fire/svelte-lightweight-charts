import {
    ChartOptions,
    createChart,
    DeepPartial,
    IChartApi,
    ISeriesApi,
    SeriesType,
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

interface SeriesEntry {
    props: SeriesProps;
    ref: ISeriesApi<SeriesType>;
}

export function chart<T extends Array<SeriesProps>>(node: HTMLElement, props: ChartProps<T>): ChartActionResult<T> {
    const {series} = props;

    let {options, reference} = props;
    let width = options?.width ?? 0;
    let height = options?.height ?? 0;

    const chart = createChart(node, options);
    const apis = new Map<string, SeriesEntry>();

    if (series !== undefined) {
        for (const current of series) {
            const api = createSeries(chart, current);
            apis.set(current.id, {
                props: current,
                ref: api,
            });
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
                chart.removeSeries(current.ref);
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
function migrateSeries(
    chart: IChartApi,
    map: Map<string, SeriesEntry>,
    props: SeriesProps[]
): void {
    const existing = new Set(map.keys());
    const next = new Map(props.map((item: SeriesProps) => [item.id, item]));

    for (const id of existing) {
        if (!next.has(id)) {
            const entry = ensure(map.get(id))
            entry.props.reference?.(null);
            chart.removeSeries(entry.ref);
            map.delete(id);
        }
    }

    for (const [id, entry] of next.entries()) {
        let api = map.get(id);
        if (api === undefined) {
            api = {
                props: entry,
                ref: createSeries(chart, entry)
            };
            map.set(id, api);
        } else {
            if (entry.type !== api.ref.seriesType()) {
                chart.removeSeries(api.ref);
                api.props.reference?.(null);
                api = {
                    props: entry,
                    ref: createSeries(chart, entry)
                };
                map.set(id, api);
            } else {
                // TODO: strictly compare series and props types (logically it is already the same)
                // TODO: change eslint ban types rule
                if (entry.options) {
                    api.ref.applyOptions(entry.options as Record<string, never>);
                }
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
