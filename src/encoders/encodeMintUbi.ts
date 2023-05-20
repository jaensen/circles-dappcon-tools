import Web3 from "web3";
import {GROUP_CURRENCY_TOKEN_ABI} from "../abis/groupCurrencyToken";
import {HoGTokenAddress, HubAddress} from "../consts";
import {MetaTransactionData} from "@safe-global/safe-core-sdk-types";
import type {CirclesSafe} from "../models/circlesSafe";
import {HUB_ABI} from "../abis/hub";
import {TOKEN_ABI} from "../abis/Token";

export async function encodeMintUbi(web3:Web3, safeAddress: string) {
    const hubContract = new web3.eth.Contract(<any>HUB_ABI, HubAddress);
    const tokenAddress = await hubContract.methods.userToToken(safeAddress).call();
    const tokenContract = new web3.eth.Contract(<any>TOKEN_ABI, tokenAddress);
    return {
        to: tokenAddress,
        value: '0',
        data: tokenContract.methods.update().encodeABI(),
    };
}
