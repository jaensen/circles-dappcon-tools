<script lang="ts">
  import { createFindSafesByOwner } from "../stores/factories/createFindSafesByOwner";
  import CirclesSafeListItem from "./listItems/CirclesSafeListItem.svelte";
  import { createEventDispatcher, onDestroy } from "svelte";
  import { CirclesSafe } from "../models/circlesSafe";

  export let ownerAddress: string = "";
  export let selectedSafe: CirclesSafe = null;
  export let circlesSafes: CirclesSafe[];
  export let canSelect: boolean = true;

  const dispatch = createEventDispatcher();
  const findSafeByOwnerStore = createFindSafesByOwner();
  const unsub = findSafeByOwnerStore.subscribe((safes) => {
    if (safes.error) {
      circlesSafes = [];
    } else {
      circlesSafes = safes.result;
    }
  });
  $: {
    findSafeByOwnerStore.search(ownerAddress);
  }

  function onSafeSelected(circlesSafe: CirclesSafe) {
    if (!canSelect) {
      return;
    }
    selectedSafe = circlesSafe;
    dispatch("safeSelected", circlesSafe);
  }

  onDestroy(() => {
    unsub();
  });
</script>

<div class="flex flex-col items-center justify-center w-full">
  <div class="flex flex-col">
    {#if !$findSafeByOwnerStore}
      <div class="text-center">Loading ...</div>
    {:else if $findSafeByOwnerStore.result?.length === 0}
      <div class="text-center">No results</div>
    {:else if $findSafeByOwnerStore.error}
      <div class="text-center text-error">
        {$findSafeByOwnerStore.error.message}
      </div>
    {:else if $findSafeByOwnerStore.result?.length > 0}
      {#each $findSafeByOwnerStore.result as circlesSafe, i}
        <div
          class="flex w-full mb-5"
          class:cursor-pointer={canSelect}
          class:bg-info={selectedSafe === circlesSafe}
        >
          <CirclesSafeListItem
            on:click={() => onSafeSelected(circlesSafe)}
            {circlesSafe}
          />
        </div>
      {/each}
    {/if}
  </div>
</div>
