import {createLiveSearchStore} from "./createLiveSearchStore";
import Web3 from "web3";
import {HoGTokenAddress} from "../../consts";
import {GROUP_CURRENCY_TOKEN_ABI} from "../../abis/groupCurrencyToken";

export type FindHoGBalanceSearchArgs = {
    address: string
    web3: Web3
}

export const createFindHoGBalance = () => createLiveSearchStore<FindHoGBalanceSearchArgs, string|undefined>(200, async (searchArg: FindHoGBalanceSearchArgs) => {
    if (!searchArg.address || searchArg.address.length !== 42 || !new Web3().utils.isAddress(searchArg.address)) {
        return undefined;
    }

    const tokenContract = new searchArg.web3.eth.Contract(<any>GROUP_CURRENCY_TOKEN_ABI, HoGTokenAddress);
    const balance = await tokenContract.methods.balanceOf(searchArg.address).call();
    return Number(searchArg.web3.utils.fromWei(balance, "ether")).toFixed(2);
}, undefined);
