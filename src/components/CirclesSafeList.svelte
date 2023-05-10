<script lang="ts">
    import { createFindSafesByOwner } from "../stores/factories/createFindSafesByOwner";
    import CirclesSafeListItem from "./listItems/CirclesSafeListItem.svelte";
    import { createEventDispatcher, onDestroy } from "svelte";
    import { CirclesSafe } from "../models/circlesSafe";

    export let ownerAddress: string = "";
    export let selectedSafe: CirclesSafe;
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

<div class="m-3 w-full">
    <ul
        class="w-full rounded-lg mt-2 mb-3 text-neutral-content flex justify-center"
    >
        {#if !$findSafeByOwnerStore}
            <li class="text-center">Loading ...</li>
        {:else if $findSafeByOwnerStore.result?.length === 0}
            <li class="text-center">No results</li>
        {:else if $findSafeByOwnerStore.error}
            <li class="text-center text-error">
                {$findSafeByOwnerStore.error.message}
            </li>
        {:else if $findSafeByOwnerStore.result?.length > 0}
            {#each $findSafeByOwnerStore.result as circlesSafe, i}
                <li
                    class="mb-2 overflow-hidden"
                    class:cursor-pointer={canSelect}
                    class:bg-info={selectedSafe === circlesSafe}
                >
                    <CirclesSafeListItem
                        on:click={() => onSafeSelected(circlesSafe)}
                        {circlesSafe}
                    />
                </li>
            {/each}
        {/if}
    </ul>
</div>
