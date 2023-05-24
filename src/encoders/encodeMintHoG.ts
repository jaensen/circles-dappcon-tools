import type Web3 from "web3";
import type { PaymentPath } from "../models/paymentPath";
import { HUB_ABI } from "../abis/hub";
import { HoGTokenAddress, HubAddress } from "../consts";
import { GROUP_CURRENCY_TOKEN_ABI } from "../abis/groupCurrencyToken";
import type { MetaTransactionData } from "@safe-global/safe-core-sdk-types";

export async function encodeMintHoG(web3: Web3, path: PaymentPath) {
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

    return <MetaTransactionData>{
        to: HoGTokenAddress,
        value: "0",
        data: mintData,
        operation: 0,
    };
}
