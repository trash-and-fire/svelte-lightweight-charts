import {
    AreaSeriesOptions,
    ChartOptions,
    createChart,
    DeepPartial,
    IChartApi,
    ISeriesApi,
    LineData,
    WhitespaceData
} from 'lightweight-charts';

export interface ChartProps {
    options?: DeepPartial<ChartOptions>;
    series?: SeriesProps[];
    reference?: (api: IChartApi | null) => void;
}

export interface SeriesProps {
    options: AreaSeriesOptions;
    data: (LineData | WhitespaceData)[];
}

export interface ChartActionResult {
    update(props: ChartProps): void;
    destroy(): void;
}

export function chart(node: HTMLElement, props: ChartProps): ChartActionResult {
    let { options, series, reference } = props;
    let width = options?.width ?? 0;
    let height = options?.height ?? 0;

    const chart = createChart(node, options);
    const apis: ISeriesApi<'Area'>[] = [];

    if (series !== undefined) {
        for (const current of series) {
            const api = chart.addAreaSeries(current.options);
            api.setData(current.data);

            apis.push(api);
        }
    }

    reference?.(chart);

    return {
        update(nextProps: ChartProps): void {
            const { options: nextOptions, reference: nextReference } = nextProps;

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
                    chart.resize(nextOptions.width ?? width, nextOptions.height ?? height, true);
                }

                options = nextOptions;
            }
        },
        destroy(): void {
            for (const current of apis) {
                chart.removeSeries(current);
            }
            chart.remove();
        }
    }
}
