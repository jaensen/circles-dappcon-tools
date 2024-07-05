import { createLiveSearchStore } from "../createLiveSearchStore";
import Web3 from "web3";
import type { CirclesSafe } from "../../../models/circlesSafe";
import { CirclesGardenApi, getSafesByOwnerApiEndpoint } from "../../../consts";

export type CirclesSafeMap = { [safeAddress: string]: CirclesSafe };

async function queryCirclesGarden(ownerAddress: string, safeAddresses: string[]): Promise<CirclesSafeMap> {
    const safeAddressCopy = JSON.parse(JSON.stringify(safeAddresses));
    const batches: string[][] = [];

    while (safeAddressCopy.length) {
        batches.push(safeAddressCopy.splice(0, 50));
    }

    const circlesSafeMap: CirclesSafeMap = {};

    if (batches.length == 0) {
        return circlesSafeMap;
    }

    const web3 = new Web3();

    for (let batch of batches) {
        const query = batch.reduce((p, c) => p + `address[]=${web3.utils.toChecksumAddress(c)}&`, "");
        const requestUrl = `${CirclesGardenApi}api/users/?${query}`;

        const requestResult = await fetch(requestUrl);
        const requestResultJson = await requestResult.json();

        const profiles: CirclesSafe[] =
            requestResultJson.data.map((o: any) => {
                return <CirclesSafe>{
                    type: "Person",
                    userName: o.username,
                    userAvatar: o.avatarUrl,
                    safeAddress: o.safeAddress.toLowerCase(),
                    ownerAddress: ownerAddress.toLowerCase(),
                };
            }) ?? [];

        profiles.forEach((o) => {
            if (!o.safeAddress) return;
            circlesSafeMap[o.safeAddress] = o;
        }, circlesSafeMap);
    }

    return circlesSafeMap;
}

async function querySafeTransactionService(ownerAddress: string) {
    const web3 = new Web3();
    const checksumAddress = web3.utils.toChecksumAddress(ownerAddress);
    const requestUrl = getSafesByOwnerApiEndpoint(checksumAddress);

    const safesByOwnerResult = await fetch(requestUrl);
    const safesByOwner = await safesByOwnerResult.json();

    return safesByOwner.safes ?? [];
}

export const createFindSafesByOwner = () => createLiveSearchStore<string, CirclesSafe[]>(200, async (ownerAddress: string) => {
    if (!ownerAddress || ownerAddress.length !== 42 || !new Web3().utils.isAddress(ownerAddress)) {
        return [];
    }

    const safeAddresses = await querySafeTransactionService(ownerAddress);
    const lowercasedSafeAddresses = safeAddresses.map(o => o.toLowerCase());
    const circlesSafeMap = await queryCirclesGarden(ownerAddress, lowercasedSafeAddresses);

    return lowercasedSafeAddresses.map(o => circlesSafeMap[o] ?? <CirclesSafe>{
        type: "Person",
        userName: "",
        safeAddress: o,
        ownerAddress: ownerAddress
    });
}, undefined);



