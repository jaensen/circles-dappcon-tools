import Web3 from "web3";
import {MetaTransactionData} from "@safe-global/safe-core-sdk-types";
import {ERC20_ABI} from "../abis/ERC20";

export async function encodeTransferErc20(web3:Web3, token:string, toAddress: string, amount: string) {
    const erc20Contract = new web3.eth.Contract(<any>ERC20_ABI, token);
    const transferData = erc20Contract.methods
        .transfer(toAddress, amount)
        .encodeABI();

    return Promise.resolve(<MetaTransactionData>{
        to: token,
        value: "0",
        data: transferData,
        operation: 0,
    });
}
