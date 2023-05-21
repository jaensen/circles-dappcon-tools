import Web3 from "web3";
import {createSafeTransactionStore} from "../createSafeTransactionStore";
import {CirclesSafe} from "../../../models/circlesSafe";
import {encodeHubOrganizationSignup} from "../../../encoders/encodeHubOrganizationSignup";

export const createOrganizationSignupStore = (web3: Web3, circlesSafe: CirclesSafe) => createSafeTransactionStore(
    web3,
    circlesSafe.ownerAddress,
    circlesSafe.safeAddress,
    async () => encodeHubOrganizationSignup(web3),
);
