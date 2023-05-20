import {writable} from "svelte/store";

export const importEoaKey = writable<string|undefined>(undefined);
