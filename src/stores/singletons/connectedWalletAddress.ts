import {writable} from "svelte/store";

export const connectedWalletAddress = writable<string|undefined>(undefined);
