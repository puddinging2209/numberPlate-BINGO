import { atom } from 'jotai';

export const BINGOAtom = atom(
    Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 5 }, (_, c) => ({ id: null, name: null }))
    )
);