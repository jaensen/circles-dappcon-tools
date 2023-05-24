import type Web3 from "web3";
import { ExecutionState } from "../../../models/executionState";
import Safe, { SafeFactory, Web3Adapter } from "@safe-global/protocol-kit";
import { writable } from "svelte/store";

export type DeploySafeStatus = {
    state: ExecutionState;
    status: string;
    safe?: Safe;
    error?: Error;
};

export const createDeploySafeStore = async (connectedWallet: Web3, connectedWalletAddress: string) => {
    const { subscribe, set, update } = writable<DeploySafeStatus>({
        state: ExecutionState.Initializing,
        status: 'Initializing Web3Adapter ...'
    });

    const deploySafe = async () => {
        const ethAdapter = new Web3Adapter({
            web3: connectedWallet,
            signerAddress: connectedWalletAddress,
        });

        update(state => ({ ...state, state: ExecutionState.Processing, status: 'Creating safe factory...' }));

        const safeFactory = await SafeFactory.create({
            ethAdapter,
            isL1SafeMasterCopy: false,
        });

        update(state => ({ ...state, state: ExecutionState.Processing, status: 'Deploying safe...' }));

        const safe = await safeFactory.deploySafe({
            safeAccountConfig: {
                owners: [connectedWalletAddress],
                threshold: 1
            }
        });

        set({ state: ExecutionState.Success, status: `Successfully deployed safe at ${safe.getAddress()}`, safe: safe });
    }

    deploySafe().catch(e => {
        console.error(e);
        set({ state: ExecutionState.Error, status: e.message, error: e });
    });

    return { subscribe };
}
