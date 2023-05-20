import {createSafeTransactionStore} from "../createSafeTransactionStore";
import {TOKEN_ABI} from "../../../abis/Token";
import type {CirclesSafe} from "../../../models/circlesSafe";
import {HUB_ABI} from "../../../abis/hub";
import {HubAddress} from "../../../consts";
import type Web3 from "web3";

export const createMintUbiStore = (web3: Web3, circlesSafe: CirclesSafe) => createSafeTransactionStore(
    web3,
    circlesSafe.ownerAddress,
    circlesSafe.safeAddress,
    async () => {
        const hubContract = new web3.eth.Contract(<any>HUB_ABI, HubAddress);
        const tokenAddress = await hubContract.methods.userToToken(circlesSafe.safeAddress).call();
        const tokenContract = new web3.eth.Contract(<any>TOKEN_ABI, tokenAddress);
        return {
            to: tokenAddress,
            value: '0',
            data: tokenContract.methods.update().encodeABI(),
        };
    },
);
