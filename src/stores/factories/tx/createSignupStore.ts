import Web3 from "web3";
import {createSafeTransactionStore} from "../createSafeTransactionStore";
import {CirclesSafe} from "../../../models/circlesSafe";
import {encodeHubSignup} from "../../../encoders/encodeHubSignup";

export const createSignupStore = (web3: Web3, circlesSafe: CirclesSafe) => createSafeTransactionStore(
    web3,
    circlesSafe.ownerAddress,
    circlesSafe.safeAddress,
    async () => encodeHubSignup(web3),
);
