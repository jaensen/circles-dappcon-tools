<script lang="ts">
  import CirclesSafeList from "../components/CirclesSafeList.svelte";
  import type { CirclesSafe } from "../models/circlesSafe";
  import {web3} from "src/stores/singletons/web3";
  import {onMount} from "svelte";

  export let params = {
    ownerAddress: "",
  };
  export let onSafeSelected: (safe: CirclesSafe) => void;
  export let onImport: () => void;
  export let onSignup: () => void;
  export let showSignup: () => boolean;
  export let showImport: () => boolean;

  let chainId: number;
  onMount(async ()=> {
    chainId = await $web3.eth.getChainId();
  });

  let circlesSafes: CirclesSafe[];
</script>

{#if (chainId && chainId !== 100)}
  <div class="text-center text-neutral-content">
    <h1 class="text-error">Your wallet is not connected to gnosis chain (chain id 100). You are connected to {chainId}.<br/> Please select the right chain and reload the page.</h1>
  </div>
{:else}
  <div class="text-center text-neutral-content">
    <h1 class="mb-5 text-4xl font-bold text-primary">Select your safe</h1>
    {#if circlesSafes && circlesSafes.length > 1}
      <p class="mb-5 text-primary">
        You have multiple Circles Safes. Please select one from below.
      </p>
    {:else if circlesSafes && circlesSafes.length === 1}
      <p class="mb-5 text-primary">Click on the Safe to continue.</p>
    {:else if circlesSafes && circlesSafes.length === 0}
      <p class="mb-5 text-primary">
        Your wallet isn't connected to any Circles Safe yet.
      </p>
    {/if}
  </div>
  <div class="max-h-[40vh] overflow-y-auto mb-5">
    <CirclesSafeList
      ownerAddress={params.ownerAddress}
      bind:circlesSafes
      on:safeSelected={(e) =>
        onSafeSelected ? onSafeSelected(e.detail) : console.log(e.detail)}
    />
  </div>
  {#if showImport()}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click class="flex p-3 text-center">
      <div class="flex-grow">
        <button
          on:click={() => onImport()}
          class="btn btn-outline text-primary rounded-full w-80">Import</button
        >
      </div>
    </a>
  {/if}
  {#if showSignup()}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click class="flex p-3 text-center">
      <div class="flex-grow">
        <button
          on:click={() => onSignup()}
          class="btn btn-outline text-primary rounded-full w-80">Sign-up</button
        >
      </div>
    </a>
  {/if}
{/if}
