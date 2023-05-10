import {writable} from "svelte/store";
import type {CirclesSafe} from "../../models/circlesSafe";

export const selectedSafe = writable<CirclesSafe>(undefined);
