import {createSafeTransactionStore} from "../createSafeTransactionStore";
import {HUB_ABI} from "../../../abis/hub";
import {GROUP_CURRENCY_TOKEN_ABI} from "../../../abis/groupCurrencyToken";
import {HubAddress, HoGTokenAddress} from "../../../consts";
import type {CirclesSafe} from "../../../models/circlesSafe";
import {MetaTransactionData} from "@safe-global/safe-core-sdk-types";
import type {PaymentPath} from "../../../models/paymentPath";
import type Web3 from "web3";

function encodeHubTransfer(web3:Web3, path: PaymentPath) {
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

    return <MetaTransactionData> {
        to: HubAddress,
        value: "0",
        data: transferThroughData,
        operation: 0,
    };
}

async function encodeMintHoG(web3: Web3, path: PaymentPath) {
    const hubContract = new web3.eth.Contract(<any>HUB_ABI, HubAddress);
    const hogContract = new web3.eth.Contract(<any>GROUP_CURRENCY_TOKEN_ABI, HoGTokenAddress);

    const pathEnds = path.path.filter(
        (o) => o.to.toLowerCase() == HoGTokenAddress.toLowerCase()
    );
    const collateralTokenOwners = pathEnds.map((o) => o.tokenOwner);

    const collateralTokens = await Promise.all(
        collateralTokenOwners.map((collateralTokenOwner) =>
            hubContract.methods.userToToken(collateralTokenOwner).call()
        )
    );

    const mintData = hogContract.methods
        .mint(
            collateralTokens,
            pathEnds.map((o) => web3.utils.toBN(o.value))
        )
        .encodeABI();

    return <MetaTransactionData> {
        to: HoGTokenAddress,
        value: "0",
        data: mintData,
        operation: 0,
    };
}

function encodeTransferHoG(web3:Web3, toAddress: string, amount: string) {
    const hogContract = new web3.eth.Contract(<any>GROUP_CURRENCY_TOKEN_ABI, HoGTokenAddress);
    const transferData = hogContract.methods
        .transfer(toAddress, amount)
        .encodeABI();

    return <MetaTransactionData>{
        to: HoGTokenAddress,
        value: "0",
        data: transferData,
        operation: 0,
    };
}

export const createMintHoGStore = (web3: Web3, circlesSafe: CirclesSafe, path: PaymentPath) =>
    createSafeTransactionStore(
        web3,
        circlesSafe.ownerAddress,
        circlesSafe.safeAddress,
        async () => {
            const hubTransferTxData = encodeHubTransfer(web3, path);
            const mintHogTxData = await encodeMintHoG(web3, path);
            const transferHoGTxData = encodeTransferHoG(web3, circlesSafe.ownerAddress, path.requestedAmount);

            return [hubTransferTxData, mintHogTxData, transferHoGTxData];
        });
