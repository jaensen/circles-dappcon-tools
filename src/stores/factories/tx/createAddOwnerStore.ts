import type Web3 from "web3";
import { createEoaTransactionStore, EoaTransactionStatus } from "../createEoaTransactionStore";
import type { TransactionConfig } from "web3-core";
import type { Readable } from "svelte/store";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { RpcEndpoint } from "../../../consts";
import { createSafeTransactionStore, SafeTransactionStatus } from "../createSafeTransactionStore";
import { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import SafeDeploymentJson from "@safe-global/safe-deployments/dist/assets/v1.3.0/gnosis_safe_l2.json";
import { createSequencerStore } from "../createSequencerStore";

export const createAddOwnerStore = async (connectedWalletWeb3: Web3, connectedWalletAddress: string, eoaKey: string, safeAddress: string) => {
    const eoaAccount = connectedWalletWeb3.eth.accounts.privateKeyToAccount(eoaKey);

    const minRequiredGasForImportedEoa = "0.01";
    const provider = new HDWalletProvider({
        privateKeys: [eoaKey],
        providerOrUrl: RpcEndpoint
    });
    const importedEoaWeb3 = new Web3(provider);
    const importedEoaBalance = await importedEoaWeb3.eth.getBalance(eoaAccount.address);
    const importedEoaNeedsGas = importedEoaWeb3.utils.toBN(importedEoaBalance)
        .lt(importedEoaWeb3.utils.toBN(importedEoaWeb3.utils.toWei(minRequiredGasForImportedEoa, "ether")));

    let fundEoaTransactionStore: () => Readable<EoaTransactionStatus> = () => importedEoaNeedsGas
        ? createEoaTransactionStore(connectedWalletWeb3, async () => {
            return <TransactionConfig>{
                from: connectedWalletAddress,
                to: eoaAccount.address,
                value: connectedWalletWeb3.utils.toWei(minRequiredGasForImportedEoa, "ether")
            }
        })
        : undefined;

    let addOwnerTransactionStore: () => Readable<SafeTransactionStatus> = () => createSafeTransactionStore(importedEoaWeb3, eoaAccount.address, safeAddress, async () => {
        const safeContract = new importedEoaWeb3.eth.Contract(<any>SafeDeploymentJson.abi, safeAddress);
        const one = importedEoaWeb3.utils.toBN("1");
        const addOwnerData = safeContract.methods.addOwnerWithThreshold(connectedWalletAddress, one).encodeABI();
        return <MetaTransactionData>{
            to: safeAddress,
            value: "0",
            data: addOwnerData
        }
    });

    return createSequencerStore([
        fundEoaTransactionStore,
        addOwnerTransactionStore
    ].filter(s => !!s));
}
