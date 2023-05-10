import {readable} from 'svelte/store';
import type {Readable} from 'svelte/store';

type Store<T> = Readable<T> | {
    subscribe: (run: (value: T) => void) => () => void;
    set?: (value: T) => void;
    update?: (updater: (value: T) => T) => void;
};

export function createCombinedStore<T extends Record<string, any>>(stores: { [K in keyof T]: Store<T[K]> }): Readable<T> {
    const initialValues: Partial<T> = {};
    const unsubscribers: Record<string, () => void> = {};

    for (const key in stores) {
        let value: any;
        const unsubscribe = stores[key].subscribe((v: any) => {
            value = v;
        });
        initialValues[key] = value;
        unsubscribers[key] = unsubscribe;
    }

    return readable<T>(initialValues as T, (set) => {
        for (const key in stores) {
            stores[key].subscribe((value: any) => {
                set({...initialValues, [key]: value} as T);
            });
        }

        return () => {
            for (const key in unsubscribers) {
                unsubscribers[key]();
            }
        };
    });
}
