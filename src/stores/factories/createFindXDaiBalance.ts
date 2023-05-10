import {createLiveSearchStore} from "./createLiveSearchStore";
import Web3 from "web3";

export type FindXDaiBalanceSearchArgs = {
    address: string
    web3: Web3
}

export const createFindXDaiBalance = () => createLiveSearchStore<FindXDaiBalanceSearchArgs, string|undefined>(200, async (searchArg: FindXDaiBalanceSearchArgs) => {
    if (!searchArg.address || searchArg.address.length !== 42 || !new Web3().utils.isAddress(searchArg.address)) {
        return undefined;
    }

    const balance = await searchArg.web3.eth.getBalance(searchArg.address);
    return Number(searchArg.web3.utils.fromWei(balance, "ether")).toFixed(2);
}, undefined);
