import {createSafeTransactionStore} from "../createSafeTransactionStore";
import type {CirclesSafe} from "../../../models/circlesSafe";
import type {PaymentPath} from "../../../models/paymentPath";
import type Web3 from "web3";
import {encodeHubTransfer} from "../../../encoders/encodeHubTransfer";
import {encodeMintHoG} from "../../../encoders/encodeMintHoG";
import {encodeTransferHoG} from "../../../encoders/encodeTransferHoG";

export const createMintHoGStore = (web3: Web3, circlesSafe: CirclesSafe, path: PaymentPath) =>
    createSafeTransactionStore(
        web3,
        circlesSafe.ownerAddress,
        circlesSafe.safeAddress,
        async () => {
            const hubTransferTxData = await encodeHubTransfer(web3, path);
            const mintHogTxData = await encodeMintHoG(web3, path);
            const transferHoGTxData = await encodeTransferHoG(web3, circlesSafe.ownerAddress, path.requestedAmount);

            return [hubTransferTxData, mintHogTxData, transferHoGTxData];
        });
