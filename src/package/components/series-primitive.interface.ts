import type {Time} from 'lightweight-charts';
import type {IReactiveSeriesPrimitive} from '../internal/series-primitive.js';

export type {IReactiveSeriesPrimitive};

export interface $$PROPS<O = object, T = Time> {
    options: O;
    view: IReactiveSeriesPrimitive<O, T>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface $$EVENTS {

}
