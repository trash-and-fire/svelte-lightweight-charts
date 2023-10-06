import type {
    ChartOptions,
    DeepPartial,
    IChartApi,
    MouseEventHandler,
    Time,
} from 'lightweight-charts';
import type {ActionResult, Reference} from './utils.js';

import {createChart} from 'lightweight-charts';

export interface ChartActionParams {
    options?: DeepPartial<ChartOptions>;
    reference?: Reference<IChartApi>;
    onClick?: MouseEventHandler<Time>;
    onCrosshairMove?: MouseEventHandler<Time>;
}

export function chart(
    node: HTMLElement,
    params: ChartActionParams
): ActionResult<ChartActionParams> {
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

    if (onClick) {
        chart.subscribeClick(onClick);
    }

    if (onCrosshairMove) {
        chart.subscribeCrosshairMove(onCrosshairMove);
    }

    return {
        update(nextParams: ChartActionParams): void {
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

            if (nextOnClick !== onClick) {
                if (onClick) {
                    chart.unsubscribeClick(onClick);
                }
                onClick = nextOnClick;
                if (onClick) {
                    chart.subscribeClick(onClick);
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
            if (onClick) {
                chart.unsubscribeClick(onClick);
            }
            if (onCrosshairMove) {
                chart.unsubscribeCrosshairMove(onCrosshairMove);
            }
            chart.remove();
            reference?.(null);
        }
    }
}
