import type {SeriesActionParams} from './series.js';
import type {ActionResult} from './utils.js';
import type {ChartActionParams} from './chart';

export function chart<T extends Array<SeriesActionParams>>(
    node: HTMLElement,
    params: ChartActionParams<T>
): ActionResult<ChartActionParams<T>> {
    throw new Error('Chart action should not be called in node context');
}
