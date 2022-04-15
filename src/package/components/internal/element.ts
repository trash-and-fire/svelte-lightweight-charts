import type {ActionResult, Reference} from '../../types';

export function element(
    node: HTMLElement,
    reference: Reference<HTMLElement> | undefined
): ActionResult<Reference<HTMLElement> | undefined> {
    let ref = reference;
    ref?.(node);

    return {
        update(nextReference: Reference<HTMLElement | null> | undefined): void {
            if (nextReference === ref) {
                return;
            }
            ref?.(null);
            ref = nextReference;
            ref?.(node);
        },
        destroy(): void {
            ref?.(null);
        }
    }
}
