import {CirclesUbiIdApi, HubAddress} from "./consts";
import Web3 from "web3";
import {HUB_ABI} from "./abis/hub";

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

export async function getMaxFlow(fromAddress: string, toAddress: string, fromBalance: string) {
    const flowResponse = await fetch(CirclesUbiIdApi, {
        "headers": {
            "content-type": "application/json"
        },
        "body": "{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  directPath(\\n    from: \\\"" + fromAddress + "\\\"\\n    to: \\\"" + toAddress + "\\\"\\n    amount: \\\"" + fromBalance + "\\\"\\n  ) {\\n    requestedAmount\\n    flow\\n    transfers {\\n      from\\n      to\\n      token\\n      tokenOwner\\n      value\\n    }\\n  }\\n}\\n\"}",
        "method": "POST"
    });

    const flowResponseJson = await flowResponse.json();

    const maxFlow = flowResponseJson.data?.directPath?.flow;
    return maxFlow ? maxFlow : "0";
}

export type PaymentPath = {
    requestedAmount: string,
    maxFlow: string,
    path: {
        from:string,
        to:string,
        tokenOwner:string,
        value:string
    }[]
};

export async function getPath(fromAddress: string, toAddress:string, transferAmount: string) : Promise<PaymentPath> {
    const flowResponse = await fetch(CirclesUbiIdApi, {
        "headers": {
            "content-type": "application/json"
        },
        "body": "{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  directPath(\\n    from: \\\"" + fromAddress + "\\\"\\n    to: \\\"" + toAddress + "\\\"\\n    amount: \\\"" + transferAmount + "\\\"\\n  ) {\\n    requestedAmount\\n    flow\\n    transfers {\\n      from\\n      to\\n      token\\n      tokenOwner\\n      value\\n    }\\n  }\\n}\\n\"}",
        "method": "POST"
    });

    const flowResponseJson = await flowResponse.json();

    const requestedAmount = flowResponseJson.data?.directPath?.requestedAmount;
    const maxFlow = flowResponseJson.data?.directPath?.flow;
    const path = flowResponseJson.data?.directPath?.transfers;

    return {
        requestedAmount: requestedAmount ? requestedAmount : "0",
        maxFlow: maxFlow ? maxFlow : "0",
        path: path ? path : []
    };
}
