import { writable } from 'svelte/store';
import {ExecutionState} from "../../models/executionState";
import {Readable} from "svelte/types/runtime/store";
import {SafeTransactionStatus} from "./createSafeTransactionStore";

export function createSequencerStore(stores:(() => Readable<SafeTransactionStatus>)[]) {
    const state = writable({
        state: ExecutionState.None,
        status: '',
    });

    let unsubscribe = null;

    function nextStore(index) {
        if (index >= stores.length) {
            return;
        }

        const currentStore = stores[index]();
        if (!currentStore && stores.length > index + 1) {
            nextStore(index + 1);
            return;
        }

        unsubscribe = currentStore.subscribe(storeState => {
            state.set(storeState);

            if (storeState.state === ExecutionState.Success) {
                unsubscribe();
                nextStore(index + 1);
            } else if (storeState.state === ExecutionState.Error) {
                unsubscribe();
                // halt the execution of the sequence on error
            }
        });
    }

    nextStore(0);

    return { subscribe: state.subscribe };
}
