import {writable} from "svelte/store";
import {CirclesSafe} from "../../models/circlesSafe";

export const selectedSafe = writable<CirclesSafe>(undefined);
