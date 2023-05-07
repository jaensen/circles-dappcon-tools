import {writable} from "svelte/store";
import Web3 from "web3";

export const web3 = writable<Web3>(undefined);
