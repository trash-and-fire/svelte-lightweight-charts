import type {IChartApi, ITimeScaleApi} from 'lightweight-charts';
import type {Reference, TimeScaleParams, ReferencableActionResult} from '../types';

export type TimeScaleActionResult = ReferencableActionResult<TimeScaleParams, ITimeScaleApi>;

export function timeScale(target: IChartApi, params: TimeScaleParams): TimeScaleActionResult {
    let {
        onVisibleTimeRangeChange,
        onVisibleLogicalRangeChange,
        onSizeChange,
    } = params;

    const subject = target.timeScale();
    let reference: Reference<ITimeScaleApi>;

    if (onVisibleTimeRangeChange) {
        subject.subscribeVisibleTimeRangeChange(onVisibleTimeRangeChange);
    }
    if (onVisibleLogicalRangeChange) {
        subject.subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChange);
    }
    if (onSizeChange) {
        subject.subscribeSizeChange(onSizeChange);
    }

    return {
        update(nextParams: TimeScaleParams): void {
            const {
                onVisibleTimeRangeChange: nextOnVisibleTimeRangeChange,
                onVisibleLogicalRangeChange: nextOnVisibleLogicalRangeChange,
                onSizeChange: nextOnSizeChange,
            } = nextParams;

            if (nextOnVisibleTimeRangeChange !== onVisibleTimeRangeChange) {
                if (onVisibleTimeRangeChange) {
                    subject.unsubscribeVisibleTimeRangeChange(onVisibleTimeRangeChange);
                }
                onVisibleTimeRangeChange = nextOnVisibleTimeRangeChange;
                if (onVisibleTimeRangeChange) {
                    subject.subscribeVisibleTimeRangeChange(onVisibleTimeRangeChange);
                }
            }

            if (nextOnVisibleLogicalRangeChange !== onVisibleLogicalRangeChange) {
                if (onVisibleLogicalRangeChange) {
                    subject.unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChange);
                }
                onVisibleLogicalRangeChange = nextOnVisibleLogicalRangeChange;
                if (onVisibleLogicalRangeChange) {
                    subject.subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChange);
                }
            }

            if (nextOnSizeChange !== onSizeChange) {
                if (onSizeChange) {
                    subject.unsubscribeSizeChange(onSizeChange);
                }
                onSizeChange = nextOnSizeChange;
                if (onSizeChange) {
                    subject.subscribeSizeChange(onSizeChange);
                }
            }
        },
        updateReference(nextReference: Reference<ITimeScaleApi>): void {
            if (nextReference !== reference) {
                reference?.(null)
                reference = nextReference;
                reference?.(subject);
            }
        },
        destroy(): void {
            if (onVisibleTimeRangeChange) {
                subject.unsubscribeVisibleTimeRangeChange(onVisibleTimeRangeChange);
            }

            if (onVisibleLogicalRangeChange) {
                subject.unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChange);
            }

            if (onSizeChange) {
                subject.unsubscribeSizeChange(onSizeChange);
            }
            
            reference?.(null);
        }
    };
}
