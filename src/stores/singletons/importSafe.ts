import {writable} from "svelte/store";
import type {CirclesSafe} from "../../models/circlesSafe";

export const importSafe = writable<CirclesSafe>(undefined);
