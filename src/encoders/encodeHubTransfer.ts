import type Web3 from "web3";
import type { PaymentPath } from "../models/paymentPath";
import { HUB_ABI } from "../abis/hub";
import { HubAddress } from "../consts";
import type { MetaTransactionData } from "@safe-global/safe-core-sdk-types";

export async function encodeHubTransfer(web3: Web3, path: PaymentPath) {
    const hubContractCallArgs = path.path.reduce(
        (p, c) => {
            p.tokenOwners.push(c.tokenOwner);
            p.srcs.push(c.from);
            p.dests.push(c.to);
            p.wads.push(c.value);
            return p;
        },
        {
            tokenOwners: [],
            srcs: [],
            dests: [],
            wads: [],
        }
    );

    const hubContract = new web3.eth.Contract(<any>HUB_ABI, HubAddress);
    const transferThroughData = hubContract.methods
        .transferThrough(
            hubContractCallArgs.tokenOwners,
            hubContractCallArgs.srcs,
            hubContractCallArgs.dests,
            hubContractCallArgs.wads
        )
        .encodeABI();

    return Promise.resolve(<MetaTransactionData>{
        to: HubAddress,
        value: "0",
        data: transferThroughData,
        operation: 0,
    });
}
