import {jest, describe, it, expect, beforeEach} from '@jest/globals';
import {collection} from '../collection';
import {ReferencableActionResult, Reference} from '../utils';

type Params = { id: string, reference: Reference<object> };

const TARGET = {};
const HEAD_ELEMENT = { id: 'head-element', reference: () => void 0 };
const MIDDLE_ELEMENT = { id: 'middle-element', reference: () => void 0 }
const TAIL_ELEMENT = { id: 'tail-element', reference: () => void 0 };

const FACTORY = jest.fn(() => ({
    update: jest.fn(),
    updateReference: jest.fn(),
    destroy: jest.fn(),
}));
const REFERENCE = (params: Params): Reference<object> => params.reference;

describe('collection', () => {
    beforeEach(() => {
       jest.clearAllMocks();
    });

    it('should create collection', () => {
        const subject = collection(TARGET, [] as Params[], FACTORY, REFERENCE);

        expect(subject).toBeDefined();
    });

    it('should use arguments', () => {
        collection(TARGET, [MIDDLE_ELEMENT], FACTORY, REFERENCE);

        expect(FACTORY).toHaveBeenCalledTimes(1);
        expect(FACTORY).toHaveBeenCalledWith(TARGET, MIDDLE_ELEMENT);

        const [{ value }] = FACTORY.mock.results;

        expect((value as ReferencableActionResult<Params, object>).updateReference).toHaveBeenCalledTimes(1);
        expect((value as ReferencableActionResult<Params, object>).updateReference).toHaveBeenCalledWith(MIDDLE_ELEMENT.reference);
    });

    it('should update existing element', () => {
        const subject = collection(TARGET, [MIDDLE_ELEMENT], FACTORY, REFERENCE);
        const nextElement = { ...MIDDLE_ELEMENT, random: Math.random() };
        subject.update([nextElement])

        const [{ value }] = FACTORY.mock.results;

        expect((value as ReferencableActionResult<Params, object>).update).toHaveBeenCalledTimes(1);
        expect((value as ReferencableActionResult<Params, object>).update).toHaveBeenCalledWith(nextElement);

        expect((value as ReferencableActionResult<Params, object>).updateReference).toHaveBeenCalledTimes(2);
        expect((value as ReferencableActionResult<Params, object>).updateReference).toHaveBeenLastCalledWith(nextElement.reference);
    });

    it('should prepend new element', () => {
        const subject = collection(TARGET, [MIDDLE_ELEMENT], FACTORY, REFERENCE);

        FACTORY.mockClear();

        subject.update([HEAD_ELEMENT, MIDDLE_ELEMENT]);

        expect(FACTORY).toHaveBeenCalledTimes(1);
        expect(FACTORY).toHaveBeenCalledWith(TARGET, HEAD_ELEMENT);

        const [{ value }] = FACTORY.mock.results;

        expect((value as ReferencableActionResult<Params, object>).updateReference).toHaveBeenCalledTimes(1);
        expect((value as ReferencableActionResult<Params, object>).updateReference).toHaveBeenCalledWith(HEAD_ELEMENT.reference);
    });

    it('should append new element', () => {
        const subject = collection(TARGET, [MIDDLE_ELEMENT], FACTORY, REFERENCE);

        FACTORY.mockClear();

        subject.update([MIDDLE_ELEMENT, TAIL_ELEMENT]);

        expect(FACTORY).toHaveBeenCalledTimes(1);
        expect(FACTORY).toHaveBeenCalledWith(TARGET, TAIL_ELEMENT);

        const [{ value }] = FACTORY.mock.results;

        expect((value as ReferencableActionResult<Params, object>).updateReference).toHaveBeenCalledTimes(1);
        expect((value as ReferencableActionResult<Params, object>).updateReference).toHaveBeenCalledWith(TAIL_ELEMENT.reference);
    });

    it('should insert new element', () => {
        const subject = collection(TARGET, [HEAD_ELEMENT, TAIL_ELEMENT], FACTORY, REFERENCE);

        FACTORY.mockClear();

        subject.update([HEAD_ELEMENT, MIDDLE_ELEMENT, TAIL_ELEMENT]);

        expect(FACTORY).toHaveBeenCalledTimes(1);
        expect(FACTORY).toHaveBeenCalledWith(TARGET, MIDDLE_ELEMENT);

        const [{ value }] = FACTORY.mock.results;

        expect((value as ReferencableActionResult<Params, object>).updateReference).toHaveBeenCalledTimes(1);
        expect((value as ReferencableActionResult<Params, object>).updateReference).toHaveBeenCalledWith(MIDDLE_ELEMENT.reference);
    });

    it('should remove element', () => {
        const subject = collection(TARGET, [HEAD_ELEMENT, TAIL_ELEMENT], FACTORY, REFERENCE);

        const [{ value }] = FACTORY.mock.results;

        subject.update([TAIL_ELEMENT]);

        expect((value as ReferencableActionResult<Params, object>).destroy).toHaveBeenCalledTimes(1);
    });

    it('should replace element', () => {
        const subject = collection(TARGET, [HEAD_ELEMENT], FACTORY, REFERENCE);
        const [{ value: head }] = FACTORY.mock.results;
        FACTORY.mockClear();

        subject.update([TAIL_ELEMENT]);

        expect((head as ReferencableActionResult<Params, object>).destroy).toHaveBeenCalledTimes(1);

        expect(FACTORY).toHaveBeenCalledTimes(1);
        expect(FACTORY).toHaveBeenCalledWith(TARGET, TAIL_ELEMENT);

        const [{ value: tail }] = FACTORY.mock.results;

        expect((tail as ReferencableActionResult<Params, object>).updateReference).toHaveBeenCalledTimes(1);
        expect((tail as ReferencableActionResult<Params, object>).updateReference).toHaveBeenCalledWith(TAIL_ELEMENT.reference);
    });

    it('should destroy elements', () => {
        const subject = collection(TARGET, [MIDDLE_ELEMENT], FACTORY, REFERENCE);

        subject.destroy();

        const [{ value }] = FACTORY.mock.results;

        expect((value as ReferencableActionResult<Params, object>).destroy).toHaveBeenCalledTimes(1);
    });
});
