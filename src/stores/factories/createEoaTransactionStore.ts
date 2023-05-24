import type Web3 from "web3";
import {writable} from "svelte/store";
import {ExecutionState} from "../../models/executionState";
import type {TransactionConfig, TransactionReceipt} from "web3-core";

export type EoaTransactionStatus = {
    state: ExecutionState;
    status: string;
    receipt?: TransactionReceipt;
    error?: Error;
};

export type EoaTransactionDataGenerator = () => Promise<TransactionConfig>;

export function createEoaTransactionStore(
    web3: Web3,
    generateTransactionData: EoaTransactionDataGenerator,
    privateKey?: string,
) {
    const {subscribe, set, update} = writable<EoaTransactionStatus>({
        state: ExecutionState.Initializing,
        status: 'Initializing transaction...'
    });

    const executeTransaction = async () => {
        update(state => ({...state, state: ExecutionState.Processing, status: 'Generating transaction data...'}));
        const transactionData = await generateTransactionData();

        if (privateKey) {
            update(state => ({...state, state: ExecutionState.Processing, status: 'Signing transaction...'}));
            const signedTransaction = await web3.eth.accounts.signTransaction(transactionData, privateKey);

            update(state => ({...state, state: ExecutionState.Processing, status: 'Sending transaction...'}));
            const transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
            set({state: ExecutionState.Success, status: '', receipt: transactionReceipt});
        } else {
            update(state => ({...state, state: ExecutionState.Processing, status: 'Sending transaction...'}));
            const transactionReceipt = await web3.eth.sendTransaction(transactionData);
            set({state: ExecutionState.Success, status: '', receipt: transactionReceipt});
        }
    };

    executeTransaction().catch(e => {
        console.error(e);
        set({state: ExecutionState.Error, status: e.message, error: e});
    });

    return {subscribe};
}
