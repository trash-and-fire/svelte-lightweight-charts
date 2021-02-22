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
    let {options, reference} = props;

    let width = options?.width ?? 0;
    let height = options?.height ?? 0;

    const chart = createChart(node, options);
    reference?.(chart);

    const {series} = props;
    const seriesCollection = new Map<string, SeriesEntry>();
    if (series !== undefined) {
        for (const current of series) {
            seriesCollection.set(current.id, {
                props: current,
                ref: createSeries(chart, current),
            });
        }
    }

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
                migrateSeries(chart, seriesCollection, nextSeries);
            }
        },
        destroy(): void {
            for (const current of seriesCollection.values()) {
                chart.removeSeries(current.ref);
            }
            chart.remove();
        }
    }
}

function createSeries<T extends SeriesProps>(
    chart: IChartApi,
    props: SeriesProps
): ISeriesApi<T['type']> {
    switch (props.type) {
        case 'Area': {
            const series = chart.addAreaSeries(props.options);
            series.setData(props.data);
            props.reference?.(series);
            return series;
        }
        case 'Bar': {
            const series = chart.addBarSeries(props.options);
            series.setData(props.data);
            props.reference?.(series);
            return series;
        }
        case 'Candlestick': {
            const series = chart.addCandlestickSeries(props.options);
            series.setData(props.data);
            props.reference?.(series);
            return series;
        }
        case 'Histogram': {
            const series = chart.addHistogramSeries(props.options);
            series.setData(props.data);
            props.reference?.(series);
            return series;
        }
        case 'Line': {
            const series = chart.addLineSeries(props.options);
            series.setData(props.data);
            props.reference?.(series);
            return series;
        }
    }
}

function migrateSeries(
    chart: IChartApi,
    collection: Map<string, SeriesEntry>,
    props: SeriesProps[]
): void {
    const existing = new Set(collection.keys());
    const next = new Map(props.map((item: SeriesProps) => [item.id, item]));

    for (const id of existing) {
        if (!next.has(id)) {
            const entry = ensure(collection.get(id))
            entry.props.reference?.(null);
            chart.removeSeries(entry.ref);
            collection.delete(id);
        }
    }

    for (const [id, options] of next.entries()) {
        let entry = collection.get(id);
        if (entry === undefined) {
            const ref = createSeries(chart, options);
            entry = {
                props: options,
                ref: ref,
            };
            collection.set(id, entry);
        } else {
            if (options.type !== entry.ref.seriesType()) {
                chart.removeSeries(entry.ref);
                entry.props.reference?.(null);

                collection.set(id, {
                    props: options,
                    ref: createSeries(chart, options)
                });
            } else {
                // There is no way to strictly match types of ISeriesApi<T> and options
                // But they are both have the same SeriesType relation in this branch
                // TODO: think about it
                if (options.options) {
                    entry.ref.applyOptions(options.options as object);
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
