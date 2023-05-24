import Web3 from "web3";
import {HoGTokenAddress} from "../consts";
import {encodeTransferErc20} from "./encodeTransferErc20";

export async function encodeTransferHoG(web3:Web3, toAddress: string, amount: string) {
    return encodeTransferErc20(web3, HoGTokenAddress, toAddress, amount);
}
