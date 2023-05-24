import {writable} from 'svelte/store';
import type {MetaTransactionData} from "@safe-global/safe-core-sdk-types";
import Safe, {Web3Adapter} from "@safe-global/protocol-kit";
import type {TransactionReceipt} from "web3-core";
import type Web3 from "web3";
import { ExecutionState } from '../../models/executionState';

export type SafeTransactionStatus = {
    state: ExecutionState;
    status: string;
    receipt?: TransactionReceipt;
    error?: Error;
};

export type SafeTransactionDataGenerator = () => Promise<MetaTransactionData | MetaTransactionData[]>;

export function createSafeTransactionStore(
    web3: Web3,
    ownerAddress: string,
    safeAddress: string,
    generateSafeTransactionData: SafeTransactionDataGenerator,
) {
    const {subscribe, set, update} = writable<SafeTransactionStatus>({
        state: ExecutionState.Initializing,
        status: 'Initializing safe sdk...'
    });

    const executeTransaction = async () => {
        const ethAdapter = new Web3Adapter({
            web3: web3,
            signerAddress: ownerAddress,
        });

        const safe: Safe = await Safe.create({
            ethAdapter: ethAdapter,
            safeAddress: safeAddress,
        });

        update(state => ({...state, state: ExecutionState.Processing, status: 'Generating safe transaction data...'}));
        const safeTransactionData = await generateSafeTransactionData();

        update(state => ({...state, state: ExecutionState.Processing, status: 'Creating safe transaction...'}));
        const safeTransaction = await safe.createTransaction({
            safeTransactionData,
        });

        update(state => ({...state, state: ExecutionState.Processing, status: 'Signing safe transaction...'}));
        const signedSafeTransaction = await safe.signTransaction(safeTransaction /*, "eth_signTypedData"*/);

        update(state => ({...state, state: ExecutionState.Processing, status: 'Sending safe transaction...'}));
        const transactionResult = await safe.executeTransaction(signedSafeTransaction);

        update(state => ({
            ...state,
            state: ExecutionState.Processing,
            status: 'Waiting for the transaction to be mined...'
        }));
        const transactionReceipt = await transactionResult.promiEvent;

        set({state: ExecutionState.Success, status: '', receipt: transactionReceipt});
    };

    executeTransaction().catch(e => {
        console.error(e);
        set({state: ExecutionState.Error, status: e.message, error: e});
    });

    return {subscribe};
}
