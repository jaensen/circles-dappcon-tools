import {CirclesUbiIdApi} from "../consts";

export async function getCrcBalance(safeAddress: string): Promise<string> {
    const balanceResponse = await fetch(CirclesUbiIdApi, {
        "headers": {
            "content-type": "application/json",
        },
        "body": "{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  profilesBySafeAddress(\\n    safeAddresses: \\\"" + safeAddress + "\\\"\\n  ) {\\n    circlesAddress\\n    balances {\\n      crcBalances {\\n        lastUpdatedAt\\n        total\\n      }\\n    }\\n  }\\n}\\n\"}",
        "method": "POST"
    });

    const balanceResponseJson = await balanceResponse.json();

    const safeInfo = balanceResponseJson.data?.profilesBySafeAddress?.length > 0
        ? balanceResponseJson.data?.profilesBySafeAddress[0]
        : undefined;

    const balance = safeInfo?.balances?.crcBalances?.total;
    return balance ? balance : "0";
}
