import { createLiveSearchStore } from "../createLiveSearchStore";
import Web3 from "web3";
import type { CirclesSafe } from "../../../models/circlesSafe";
import { CirclesGardenApi, CirclesSubgraphApi } from "../../../consts";

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
                    userAvatar: o.avataUrl,
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

async function queryCirclesSubgraph(ownerAddress: string) {
    const args = {
        "headers": {
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.5",
            "content-type": "application/json",
        },
        "body": "{\"query\":\"{\\n  user(id: \\\"" + ownerAddress.toLowerCase() + "\\\") {\\n    safeAddresses\\n  }\\n}\",\"variables\":null,\"extensions\":{\"headers\":null}}",
        "method": "POST"
    };

    const safesByOwnerResult = await fetch(CirclesSubgraphApi, args);
    const safesByOwner = await safesByOwnerResult.json();

    return safesByOwner.data.user?.safeAddresses ?? [];
}

export const createFindSafesByOwner = () => createLiveSearchStore<string, CirclesSafe[]>(200, async (ownerAddress: string) => {
    if (!ownerAddress || ownerAddress.length !== 42 || !new Web3().utils.isAddress(ownerAddress)) {
        return [];
    }

    const safeAddresses = await queryCirclesSubgraph(ownerAddress);
    const circlesSafeMap = await queryCirclesGarden(ownerAddress, safeAddresses);

    return safeAddresses.map(o => circlesSafeMap[o] ?? <CirclesSafe>{
        type: "Person",
        userName: "",
        safeAddress: o,
        ownerAddress: ownerAddress
    });
}, undefined);
