import {createLiveSearchStore} from "./createLiveSearchStore";
import Web3 from "web3";
import {HUB_ABI} from "../../../abis/hub";
import {CirclesUbiIdApi, HubAddress} from "../../../consts";
import {ZERO_ADDRESS} from "@safe-global/protocol-kit/dist/src/utils/constants";
import type {PaymentPath} from "../../../models/paymentPath";

export type PaymentPathSearchArgs = {
    from: string
    to: string
    amount: string,
    web3: Web3
}

export const EmptyPath: PaymentPath = {
    requestedAmount: "0",
    maxFlow: "0",
    path: []
}

export const createFindPaymentPath = () => createLiveSearchStore<PaymentPathSearchArgs, PaymentPath>(200, async (searchArgs: PaymentPathSearchArgs) => {
    // Check if 'from' and 'to' are valid addresses and are signed up at the hub
    if (!searchArgs.from || searchArgs.from.length !== 42 || !new Web3().utils.isAddress(searchArgs.from)) {
        return EmptyPath;
    }
    if (!searchArgs.to || searchArgs.to.length !== 42 || !new Web3().utils.isAddress(searchArgs.to)) {
        return EmptyPath;
    }

    // Check if 'from' and 'to' are signed up at the Circles Hub
    const hubContract = new searchArgs.web3.eth.Contract(<any>HUB_ABI, HubAddress);
    const isSignedUpResult = await Promise.all([
          hubContract.methods.userToToken(searchArgs.from).call()
        , hubContract.methods.organizations(searchArgs.from).call()
        , hubContract.methods.userToToken(searchArgs.to).call()
        , hubContract.methods.organizations(searchArgs.to).call()]);

    if ((!isSignedUpResult[0] || isSignedUpResult[0] == ZERO_ADDRESS) && !isSignedUpResult[1]) {
        console.warn(`'from' address ${searchArgs.from} is not signed up at the Circles Hub`);
        return EmptyPath;
    }

    if ((!isSignedUpResult[2] || isSignedUpResult[2] == ZERO_ADDRESS) && !isSignedUpResult[3]) {
        console.warn(`'to' address ${searchArgs.to} is not signed up at the Circles Hub`);
        return EmptyPath;
    }

    try {
        if (!searchArgs.amount || !searchArgs.web3.utils.toBN(searchArgs.amount)) {
            console.warn(`'amount' ${searchArgs.amount} is not a valid BN number`);
            return EmptyPath;
        }
    } catch (e) {
        console.error(e);
        console.warn(`'amount' ${searchArgs.amount} is not a valid BN number`);
        return EmptyPath;
    }

    const flowResponse = await fetch(CirclesUbiIdApi, {
        "headers": {
            "content-type": "application/json"
        },
        "body": "{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  directPath(\\n    from: \\\"" + searchArgs.from + "\\\"\\n    to: \\\"" + searchArgs.to + "\\\"\\n    amount: \\\"" + searchArgs.amount + "\\\"\\n  ) {\\n    requestedAmount\\n    flow\\n    transfers {\\n      from\\n      to\\n      token\\n      tokenOwner\\n      value\\n    }\\n  }\\n}\\n\"}",
        "method": "POST"
    });

    const flowResponseJson = await flowResponse.json();
    const requestedAmount = flowResponseJson.data?.directPath?.requestedAmount;
    const maxFlow = flowResponseJson.data?.directPath?.flow;
    const path = flowResponseJson.data?.directPath?.transfers;

    return <PaymentPath>{
        requestedAmount: requestedAmount ? requestedAmount : "0",
        maxFlow: maxFlow ? maxFlow : "0",
        path: path ? path : []
    };
}, undefined);
