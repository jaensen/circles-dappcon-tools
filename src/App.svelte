<script lang="ts">
    import './app.css'
    import Home from "./pages/Home.svelte";
    import EnterSeedPhrase from "./pages/EnterSeedPhrase.svelte";
    import ChooseSafe from "./pages/ChooseSafe.svelte";
    import ChooseEoa from "./pages/ChooseEoa.svelte";
    import AddOwnerToSafe from "./pages/AddOwnerToSafe.svelte";
    import {CirclesSafe} from "./models/circlesSafe";
    import {jumpToAnchor} from "./utils";

    let ownerAddress: string;
    let selectedSafe: CirclesSafe;
    let hasValidKey = false;
    let mnemonicPhrase:string;
    let newOwnerAddress: string;

    function eoaConnected(event) {
        const wallet = event.detail;
        newOwnerAddress = wallet.accounts[0].address;
        setTimeout(() => {
            jumpToAnchor('add-owner');
        }, 0);
    }

    function eoaDisconnected(label) {
        newOwnerAddress = undefined;
        jumpToAnchor('connect-eoa');
    }

    function onSafeSelected(safe: CirclesSafe) {
        selectedSafe = safe;
        setTimeout(() => {
            if (newOwnerAddress) {
                jumpToAnchor('add-owner');
            } else {
                jumpToAnchor('connect-eoa');
            }
        }, 0);
    }
</script>

<a name="home"></a>
<Home></Home>
<a name="seedphrase"></a>
<EnterSeedPhrase bind:mnemonicPhrase={mnemonicPhrase}
                 bind:address={ownerAddress}
                 bind:hasValidKey={hasValidKey} />
{#if hasValidKey}
    <a name="select-safe"></a>
    <ChooseSafe on:safeSelected={e => onSafeSelected(e.detail)}
                bind:ownerAddress={ownerAddress} />
{/if}
{#if selectedSafe}
    <a name="connect-eoa"></a>
    <ChooseEoa on:connected={eoaConnected}
               on:disconnected={eoaDisconnected} />
{/if}
{#if hasValidKey && newOwnerAddress}
    <a name="add-owner"></a>
    <AddOwnerToSafe selectedSafe={selectedSafe}
                    bind:mnemonicPhrase={mnemonicPhrase}
                    newOwnerAddress={newOwnerAddress} />
{/if}
