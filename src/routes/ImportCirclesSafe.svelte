<script lang="ts">
  import { writable } from 'svelte/store';
  import { createEventDispatcher } from "svelte";
  import EnterSeedPhrase from "../pages/EnterSeedPhrase.svelte";
  import { CirclesSafe } from "../models/circlesSafe";
  import ChooseSafe from "../pages/ChooseSafe.svelte";
  import { selectedSafe } from "../stores/singletons/selectedSafe";
  import { connectedWalletAddress } from "../stores/singletons/connectedWalletAddress";
  import { push } from "svelte-spa-router";
  import AddOwnerToSafe2 from "../pages/AddOwnerToSafe2.svelte";

  const dispatcher = createEventDispatcher();

  let ownerAddress: string;
  let hasValidKey = false;
  let mnemonicPhrase: string;

  const pageState = writable('enterSeedPhrase'); // store the current page

  function onSafeSelected(safe: CirclesSafe) {
    selectedSafe.set(safe);
    pageState.set('addOwnerToSafe2');
  }

  function onEoaLoaded(event) {
    pageState.set('chooseSafe');
  }

  function onAddOwnerSuccess(event) {
    selectedSafe.set(event.detail);
    push("/");
  }
</script>

{#if !$connectedWalletAddress}
  <p class="text-center text-error">
    The '$connectedWalletAddress' store is not set. This value must contain the
    address of the EOA that should be added as additional owner.
  </p>
{:else}
  {#if $pageState === 'enterSeedPhrase'}
    <EnterSeedPhrase
            on:eoaLoaded={onEoaLoaded}
            bind:mnemonicPhrase
            bind:address={ownerAddress}
            bind:hasValidKey
    />
  {:else if $pageState === 'chooseSafe' && hasValidKey}
    <ChooseSafe
            on:safeSelected={(e) => onSafeSelected(e.detail)}
            showImport={false}
            showSignup={false}
            bind:ownerAddress
    />
  {:else if $pageState === 'addOwnerToSafe2' && $selectedSafe}
    <AddOwnerToSafe2
            selectedSafe={$selectedSafe}
            on:success={onAddOwnerSuccess}
            bind:mnemonicPhrase
            newOwnerAddress={$connectedWalletAddress}
    />
  {/if}
{/if}
