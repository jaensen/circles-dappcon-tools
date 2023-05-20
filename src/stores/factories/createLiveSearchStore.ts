import { writable } from 'svelte/store';

/**
 * Creates a Svelte store for performing live searches with throttling.
 * It only keeps the latest search argument and discards all previous ones per interval.
 * Use search() to perform a live search. Use subscribe() to subscribe to the search result.
 *
 * @template TArg - The type of the search argument
 * @template TResult - The type of the search result.
 * @param {number} throttleInterval - The interval in milliseconds to wait between search requests.
 * @param {(searchArg: TArg) => Promise<TResult>} performLiveSearch - The actual search implementation.
 * @param {TResult} defaultValue - The default value for the store.
 * @returns {{subscribe: import('svelte/store').Readable<T | undefined>; search: (searchArg: T) => Promise<void>;}} - An object containing a `subscribe` function for subscribing to store changes and a `search` function for performing live searches.
 */
export function createLiveSearchStore<TArg, TResult>(
    throttleInterval: number,
    performLiveSearch: (searchArg: TArg) => Promise<TResult>,
    defaultValue?: TResult
) {
    let buffer: TArg | undefined = undefined;
    let executing = false;

    const { subscribe, set } = writable<{ result: TResult | undefined; error: any }>({ result: defaultValue, error: undefined });

    async function executeSearch(searchArg: TArg) {
        executing = true;
        try {
            const result = await performLiveSearch(searchArg);
            set({ result, error: undefined });
        } catch (error) {
            set({ result: undefined, error });
        }
        executing = false;

        if (buffer) {
            const nextArg = buffer;
            buffer = undefined;
            setTimeout(() => {
                executeSearch(nextArg);
            }, throttleInterval);
        }
    }

    function search(searchArg: TArg) {
        buffer = searchArg;

        if (!executing) {
            const nextArg = buffer;
            buffer = undefined;
            executeSearch(nextArg)
                .catch(console.error);
        }
    }

    return {
        subscribe,
        search,
    };
}
