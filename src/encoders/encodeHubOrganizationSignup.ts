import type Web3 from "web3";
import { GROUP_CURRENCY_TOKEN_ABI } from "../abis/groupCurrencyToken";
import { HoGTokenAddress, HubAddress } from "../consts";
import type { MetaTransactionData } from "@safe-global/safe-core-sdk-types";
import type { CirclesSafe } from "../models/circlesSafe";
import { HUB_ABI } from "../abis/hub";

export async function encodeHubOrganizationSignup(web3: Web3) {
    const hubContract = new web3.eth.Contract(<any>HUB_ABI, HubAddress);
    return Promise.resolve({
        to: HubAddress,
        value: '0',
        data: hubContract.methods.organizationSignup().encodeABI(),
    });
}
