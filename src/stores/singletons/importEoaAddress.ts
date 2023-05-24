import {writable} from "svelte/store";

export const importEoaAddress = writable<string|undefined>(undefined);
