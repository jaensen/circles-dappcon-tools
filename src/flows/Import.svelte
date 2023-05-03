<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import EnterSeedPhrase from "../pages/EnterSeedPhrase.svelte";
    import {CirclesSafe} from "../models/circlesSafe";
    import {jumpToAnchor} from "../utils";
    import ChooseSafe from "../pages/ChooseSafe.svelte";
    import AddOwnerToSafe from "../pages/AddOwnerToSafe.svelte";

    const dispatcher = createEventDispatcher();

    export let selectedSafe: CirclesSafe;
    export let newOwnerAddress: string;

    let ownerAddress: string;
    let hasValidKey = false;
    let mnemonicPhrase:string;

    function onSafeSelected(safe: CirclesSafe) {
        selectedSafe = safe;
        setTimeout(() => {
            jumpToAnchor('add-owner');
        }, 0);
    }
</script>
{#if !newOwnerAddress}
<p class="text-error text-center">The 'newOwnerAddress' property is not set.
    This value must contain the address of the EOA that should be added as additional owner.</p>
{:else}
    <a name="seedphrase"></a>
    <EnterSeedPhrase bind:mnemonicPhrase={mnemonicPhrase}
                     bind:address={ownerAddress}
                     bind:hasValidKey={hasValidKey} />
    {#if hasValidKey}
        <a name="select-safe"></a>
        <ChooseSafe on:safeSelected={e => onSafeSelected(e.detail)}
                    showImport={false}
                    showSignup={false}
                    bind:ownerAddress={ownerAddress} />
    {/if}
    {#if selectedSafe}
        <a name="add-owner"></a>
        <AddOwnerToSafe selectedSafe={selectedSafe}
                        on:success
                        bind:mnemonicPhrase={mnemonicPhrase}
                        newOwnerAddress={newOwnerAddress} />
    {/if}
{/if}
