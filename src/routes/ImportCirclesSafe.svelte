<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import EnterSeedPhrase from "../pages/EnterSeedPhrase.svelte";
    import {CirclesSafe} from "../models/circlesSafe";
    import ChooseSafe from "../pages/ChooseSafe.svelte";
    import AddOwnerToSafe from "../pages/AddOwnerToSafe.svelte";
    import {selectedSafe} from "../stores/singletons/selectedSafe";
    import {connectedWalletAddress} from "../stores/singletons/connectedWalletAddress";

    const dispatcher = createEventDispatcher();

    let ownerAddress: string;
    let hasValidKey = false;
    let mnemonicPhrase:string;

    function onSafeSelected(safe: CirclesSafe) {
        selectedSafe.set(safe);
    }
</script>
{#if !$connectedWalletAddress}
    <p class="text-error text-center">The '$connectedWalletAddress' store is not set.
        This value must contain the address of the EOA that should be added as additional owner.</p>
{:else}
    <EnterSeedPhrase bind:mnemonicPhrase={mnemonicPhrase}
                     bind:address={ownerAddress}
                     bind:hasValidKey={hasValidKey} />
    {#if hasValidKey}
        <ChooseSafe on:safeSelected={e => onSafeSelected(e.detail)}
                    showImport={false}
                    showSignup={false}
                    bind:ownerAddress={ownerAddress} />
    {/if}
    {#if $selectedSafe}
        <AddOwnerToSafe selectedSafe={$selectedSafe}
                        on:success
                        bind:mnemonicPhrase={mnemonicPhrase}
                        newOwnerAddress={$connectedWalletAddress} />
    {/if}
{/if}
