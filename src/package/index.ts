import {
    ChartOptions,
    createChart,
    DeepPartial,
    IChartApi,
    MouseEventHandler,
} from 'lightweight-charts';
import type {ActionResult, Reference, SeriesActionParams} from './types';
import {seriesCollection} from './internal/series';

export interface ChartActionParams<T extends Array<SeriesActionParams>> {
    options?: DeepPartial<ChartOptions>;
    series?: T;
    reference?: Reference<IChartApi>;
    onClick?: MouseEventHandler;
    onCrosshairMove?: MouseEventHandler;
}

export function chart<T extends Array<SeriesActionParams>>(
    node: HTMLElement,
    params: ChartActionParams<T>
): ActionResult<ChartActionParams<T>> {
    let {
        options,
        reference,
        onClick,
        onCrosshairMove,
    } = params;

    let width = options?.width ?? 0;
    let height = options?.height ?? 0;

    const chart = createChart(node, options);
    reference?.(chart);

    const series = seriesCollection(chart, params.series);

    if (onClick) {
        chart.subscribeClick(onClick);
    }

    if (onCrosshairMove) {
        chart.subscribeCrosshairMove(onCrosshairMove);
    }

    return {
        update(nextParams: ChartActionParams<T>): void {
            const {
                options: nextOptions,
                reference: nextReference,
                onClick: nextOnClick,
                onCrosshairMove: nextOnCrosshairMove,
            } = nextParams;

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

            series.update(nextParams.series);

            if (nextOnClick !== onClick) {
                if (onClick) {
                    chart.unsubscribeCrosshairMove(onClick);
                }
                onClick = nextOnClick;
                if (onClick) {
                    chart.subscribeCrosshairMove(onClick);
                }
            }

            if (nextOnCrosshairMove !== onCrosshairMove) {
                if (onCrosshairMove) {
                    chart.unsubscribeCrosshairMove(onCrosshairMove);
                }
                onCrosshairMove = nextOnCrosshairMove;
                if (onCrosshairMove) {
                    chart.subscribeCrosshairMove(onCrosshairMove);
                }
            }
        },
        destroy(): void {
            series.destroy();
            if (onClick) {
                chart.unsubscribeCrosshairMove(onClick);
            }
            if (onCrosshairMove) {
                chart.unsubscribeCrosshairMove(onCrosshairMove);
            }
            chart.remove();
            reference?.(null);
        }
    }
}

export default chart;
