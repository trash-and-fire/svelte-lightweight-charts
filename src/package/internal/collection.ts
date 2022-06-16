import type {ActionResult, ReferencableActionResult, Reference} from './utils.js';
import {ensure} from './utils.js';

export function collection<T, K, P extends { id: string }, R extends ReferencableActionResult<P, K>>(
    target: T,
    params: P[] = [],
    factory: (target: T, params: P) => R,
    reference: (params: P) => Reference<K> | undefined
): ActionResult<P[] | undefined> {
    const collection = new Map<string, R>();
    for (const current of params) {
        const result = factory(target, current);
        result.updateReference(reference(current));

        collection.set(current.id, result);
    }

    return {
        update(nextParams: P[] = []): void {
            const existing = new Set(collection.keys());
            const next = new Map(nextParams.map((item: P) => [item.id, item]));

            for (const id of existing) {
                if (!next.has(id)) {
                    const entry = ensure(collection.get(id))
                    entry.destroy();

                    collection.delete(id);
                }
            }

            for (const [id, options] of next.entries()) {
                const entry = collection.get(id);
                if (entry === undefined) {
                    const created = factory(target, options);
                    created.updateReference(reference(options));
                    collection.set(id, created);
                } else {
                    entry.update(options);
                    entry.updateReference(reference(options));
                }
            }
        },
        destroy() {
            for (const current of collection.values()) {
                current.destroy();
            }
        }
    }
}
