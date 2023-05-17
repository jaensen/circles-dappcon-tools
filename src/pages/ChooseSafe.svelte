<script lang="ts">
  import CirclesSafeList from "../components/CirclesSafeList.svelte";
  import { type CirclesSafe } from "../models/circlesSafe";
  import { createEventDispatcher } from "svelte";
  import Frame from "../components/Frame.svelte";

  export let ownerAddress = "";
  export let showSignup = true;
  export let showImport = true;

  let circlesSafes: CirclesSafe[];

  const dispatcher = createEventDispatcher();
</script>

<Frame>
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
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
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
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a on:click class="flex p-3 text-center">
      <div class="flex-grow">
        <button
          on:click={() => dispatcher("signup")}
          class="btn btn-outline text-primary">Sign-up</button
        >
      </div>
    </a>
  {/if}
</Frame>
