import { createLiveSearchStore } from "./createLiveSearchStore";
import Web3 from "web3";
import { CirclesGardenApi, CirclesSubgraphApi } from "../../consts";
async function queryCirclesGarden(ownerAddress, safeAddresses) {
    var _a;
    const safeAddressCopy = JSON.parse(JSON.stringify(safeAddresses));
    const batches = [];
    while (safeAddressCopy.length) {
        batches.push(safeAddressCopy.splice(0, 50));
    }
    const circlesSafeMap = {};
    if (batches.length == 0) {
        return circlesSafeMap;
    }
    const web3 = new Web3();
    for (let batch of batches) {
        const query = batch.reduce((p, c) => p + `address[]=${web3.utils.toChecksumAddress(c)}&`, "");
        const requestUrl = `${CirclesGardenApi}api/users/?${query}`;
        const requestResult = await fetch(requestUrl);
        const requestResultJson = await requestResult.json();
        const profiles = (_a = requestResultJson.data.map((o) => {
            return {
                type: "Person",
                userName: o.username,
                userAvatar: o.avataUrl,
                safeAddress: o.safeAddress.toLowerCase(),
                ownerAddress: ownerAddress.toLowerCase(),
            };
        })) !== null && _a !== void 0 ? _a : [];
        profiles.forEach((o) => {
            if (!o.safeAddress)
                return;
            circlesSafeMap[o.safeAddress] = o;
        }, circlesSafeMap);
    }
    return circlesSafeMap;
}
async function queryCirclesSubgraph(ownerAddress) {
    var _a, _b;
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
    return (_b = (_a = safesByOwner.data.user) === null || _a === void 0 ? void 0 : _a.safeAddresses) !== null && _b !== void 0 ? _b : [];
}
export const createFindSafesByOwner = () => createLiveSearchStore(200, async (ownerAddress) => {
    if (!ownerAddress || ownerAddress.length !== 42 || !new Web3().utils.isAddress(ownerAddress)) {
        return [];
    }
    const safeAddresses = await queryCirclesSubgraph(ownerAddress);
    const circlesSafeMap = await queryCirclesGarden(ownerAddress, safeAddresses);
    return safeAddresses.map(o => {
        var _a;
        return (_a = circlesSafeMap[o]) !== null && _a !== void 0 ? _a : {
            type: "Person",
            userName: "",
            safeAddress: o,
            ownerAddress: ownerAddress
        };
    });
}, undefined);
//# sourceMappingURL=createFindSafesByOwner.js.map