import {createSafeTransactionStore} from "../createSafeTransactionStore";
import type {CirclesSafe} from "../../../models/circlesSafe";
import type Web3 from "web3";
import {encodeMintUbi} from "../../../encoders/encodeMintUbi";

export const createMintUbiStore = (web3: Web3, circlesSafe: CirclesSafe) => createSafeTransactionStore(
    web3,
    circlesSafe.ownerAddress,
    circlesSafe.safeAddress,
    async () => encodeMintUbi(web3, circlesSafe.safeAddress),
);
