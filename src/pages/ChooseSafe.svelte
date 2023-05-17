<script lang="ts">
  import CirclesSafeList from "../components/CirclesSafeList.svelte";
  import { CirclesSafe } from "../models/circlesSafe";
  import { createEventDispatcher } from "svelte";

  export let ownerAddress = "";
  export let showSignup = true;
  export let showImport = true;
  export let anchorElementId = "ChooseSafe";

  let circlesSafes: CirclesSafe[];

  const dispatcher = createEventDispatcher();
</script>

<div class="absolute py-2.5 px-5">
  <img src="/images/dappconf-blue.png" class="w-[60px]" alt="DappConf" />
</div>
<div id={anchorElementId} />

<div class="flex h-screen px-5 bg-blue">
  <div class="m-auto text-center text-primary">
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
      <CirclesSafeList bind:ownerAddress bind:circlesSafes on:safeSelected />
    </div>
    {#if showImport}
      <a on:click class="flex p-3 text-center">
        <div class="flex-grow">
          <button
            on:click={() => dispatcher("import")}
            class="btn btn-outline text-primary">Import</button
          >
        </div>
      </a>
    {/if}
    {#if showSignup}
      <a on:click class="flex p-3 text-center">
        <div class="flex-grow">
          <button
            on:click={() => dispatcher("signup")}
            class="btn btn-outline text-primary">Sign-up</button
          >
        </div>
      </a>
    {/if}
  </div>
</div>
