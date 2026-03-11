import { atom } from 'jotai';

export const BINGOAtom = atom(
    Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 5 }, (_, c) => ({ id: null, name: null, point: 0 }))
    )
);

export const ReferencePointAtom = atom([136.729068, 35.033053]);