import {CirclesUbiIdApi} from "../consts";
import type {PaymentPath} from "../models/paymentPath";

export async function calculatePaymentPath(fromAddress: string, toAddress:string, transferAmount: string) : Promise<PaymentPath> {
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
