<script lang="ts">
    import ChooseSafe from "../pages/ChooseSafe.svelte";
    import {CirclesSafe} from "../models/circlesSafe";
    import {jumpToAnchor} from "../utils";
    import ConnectWallet from "../pages/ConnectWallet.svelte";
    import {createEventDispatcher} from "svelte";

    export let connectedWallet: any;
    export let connectedWalletAddress: string;
    export let selectedSafe: CirclesSafe;

    const dispatcher = createEventDispatcher();

    function onWalletConnected(event) {
        dispatcher("connected", event.detail);
        connectedWallet = event.detail;
        connectedWalletAddress = event.detail.accounts[0].address;
        setTimeout(() => jumpToAnchor('select-safe'), 0);
    }

    function onWalletDisconnected(label) {
        console.info('Disconnected from wallet:', label);

        dispatcher("disconnected", label);
        connectedWallet = undefined;
        connectedWalletAddress = undefined;
    }

    function onSafeSelected(safe: CirclesSafe) {
        selectedSafe = safe;
        dispatcher("safeSelected", safe);
    }
</script>

<a name="connect-eoa"></a>
<ConnectWallet on:connected={onWalletConnected}
               on:disconnected={onWalletDisconnected} />
{#if connectedWalletAddress}
    <a name="select-safe"></a>
    <ChooseSafe on:safeSelected={e => onSafeSelected(e.detail)}
                on:import
                on:signup
                bind:ownerAddress={connectedWalletAddress} />
{/if}
