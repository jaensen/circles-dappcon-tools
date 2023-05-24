import { createLiveSearchStore } from "../createLiveSearchStore";
import Web3 from "web3";
import { CirclesUbiIdApi } from "../../../consts";

export type FindCrcBalanceSearchArgs = {
    address: string
}

export const createFindCrcBalance = () => createLiveSearchStore<FindCrcBalanceSearchArgs, string | undefined>(200, async (searchArg: FindCrcBalanceSearchArgs) => {
    if (!searchArg.address || searchArg.address.length !== 42 || !new Web3().utils.isAddress(searchArg.address)) {
        return undefined;
    }

    const balanceResponse = await fetch(CirclesUbiIdApi, {
        "headers": {
            "content-type": "application/json",
        },
        "body": "{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  profilesBySafeAddress(\\n    safeAddresses: \\\"" + searchArg.address + "\\\"\\n  ) {\\n    circlesAddress\\n    balances {\\n      crcBalances {\\n        lastUpdatedAt\\n        total\\n      }\\n    }\\n  }\\n}\\n\"}",
        "method": "POST"
    });

    const balanceResponseJson = await balanceResponse.json();

    const safeInfo = balanceResponseJson.data?.profilesBySafeAddress?.length > 0
        ? balanceResponseJson.data?.profilesBySafeAddress[0]
        : undefined;

    const balance = safeInfo?.balances?.crcBalances?.total;
    return balance ? balance : "0";
}, undefined);
