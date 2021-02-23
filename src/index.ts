import {
    ChartOptions,
    createChart,
    DeepPartial,
    IChartApi,
} from 'lightweight-charts';
import type {ActionResult, SeriesActionParams} from './types';
import {seriesCollection} from './series';

export interface ChartActionParams<T extends Array<SeriesActionParams>> {
    options?: DeepPartial<ChartOptions>;
    series?: T;
    reference?: (api: IChartApi | null) => void;
}

export function chart<T extends Array<SeriesActionParams>>(
    node: HTMLElement,
    params: ChartActionParams<T>
): ActionResult<ChartActionParams<T>> {
    let {options, reference} = params;

    let width = options?.width ?? 0;
    let height = options?.height ?? 0;

    const chart = createChart(node, options);
    reference?.(chart);

    const series = seriesCollection(chart, params.series);

    return {
        update(nextProps: ChartActionParams<T>): void {
            const {options: nextOptions, reference: nextReference} = nextProps;

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

            series.update(nextProps.series);
        },
        destroy(): void {
            series.destroy();
            chart.remove();
            reference?.(null);
        }
    }
}
