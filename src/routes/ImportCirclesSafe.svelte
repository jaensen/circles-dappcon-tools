<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import EnterSeedPhrase from "../pages/EnterSeedPhrase.svelte";
    import {CirclesSafe} from "../models/circlesSafe";
    import ChooseSafe from "../pages/ChooseSafe.svelte";
    import AddOwnerToSafe from "../pages/AddOwnerToSafe.svelte";
    import {selectedSafe} from "../stores/singletons/selectedSafe";
    import {connectedWalletAddress} from "../stores/singletons/connectedWalletAddress";
    import {push} from "svelte-spa-router";

    const dispatcher = createEventDispatcher();

    let ownerAddress: string;
    let hasValidKey = false;
    let mnemonicPhrase:string;

    const chooseSafeAnchorElementId: string = "ChooseSafe";
    const addOwnerAnchorElementId: string = "AddOwnerToSafe";

    function onSafeSelected(safe: CirclesSafe) {
        selectedSafe.set(safe);
        document.getElementById(addOwnerAnchorElementId).scrollIntoView();
    }

    function onEoaLoaded(event) {
        // const eoaAddress = event.detail;
        document.getElementById(chooseSafeAnchorElementId).scrollIntoView();
    }

    function onAddOwnerSuccess(event) {
        selectedSafe.set(event.detail)
        push("/")
    }
</script>
{#if !$connectedWalletAddress}
    <p class="text-error text-center">The '$connectedWalletAddress' store is not set.
        This value must contain the address of the EOA that should be added as additional owner.</p>
{:else}
    <EnterSeedPhrase on:eoaLoaded={onEoaLoaded}
                     bind:mnemonicPhrase={mnemonicPhrase}
                     bind:address={ownerAddress}
                     bind:hasValidKey={hasValidKey} />
    {#if hasValidKey}
        <ChooseSafe on:safeSelected={e => onSafeSelected(e.detail)}
                    anchorElementId={chooseSafeAnchorElementId}
                    showImport={false}
                    showSignup={false}
                    bind:ownerAddress={ownerAddress} />
    {/if}
    {#if $selectedSafe}
        <AddOwnerToSafe selectedSafe={$selectedSafe}
                        anchorElementId={addOwnerAnchorElementId}
                        on:success={onAddOwnerSuccess}
                        bind:mnemonicPhrase={mnemonicPhrase}
                        newOwnerAddress={$connectedWalletAddress} />
    {/if}
{/if}
