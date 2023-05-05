<script lang="ts">
    import Web3 from "web3";
    import Safe from "@safe-global/protocol-kit";
    import {createEventDispatcher, onMount} from "svelte";

    export let web3: Web3;
    export let circlesSafe: Safe;
    export let toAddress: string;

    let crcBalance: string;
    let maxFlow: string;

    async function getCrcBalance() : Promise<string> {
        const safeAddress = circlesSafe.getAddress().toLowerCase();
        const balanceResponse = await fetch("https://dev.api.circlesubi.id/", {
            "headers": {
                "content-type": "application/json",
            },
            "body": "{\"operationName\":null,\"variables\":{},\"query\":\"{\\n  profilesBySafeAddress(\\n    safeAddresses: \\\"" + safeAddress + "\\\"\\n  ) {\\n    circlesAddress\\n    balances {\\n      crcBalances {\\n        lastUpdatedAt\\n        total\\n      }\\n    }\\n  }\\n}\\n\"}",
            "method": "POST"
        });

        const safeInfo = balanceResponse.data?.profilesBySafeAddress?.length > 0
            ? balanceResponse.data?.profilesBySafeAddress[0]
            : undefined;

        const balance = safeInfo?.balances?.crcBalances?.total;
        return balance ? balance : "0";
    }

    if (web3 && circlesSafe && toAddress) {
        getCrcBalance().then(balance => crcBalance = balance);
        circlesSafe.getMaxFlow(toAddress).then(flow => maxFlow = flow);
    }

    const dispatch = createEventDispatcher();
</script>

<div class="hero min-h-screen" style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
        <div>
            <h1 class="mb-5 text-5xl font-bold">${}</h1>
        </div>
    </div>
</div>
