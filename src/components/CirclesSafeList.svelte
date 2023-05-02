<script lang="ts">
    import {createFindSafesByOwner} from "../stores/factories/createFindSafesByOwner";
    import CirclesSafeListItem from "./listItems/CirclesSafeListItem.svelte";
    import {createEventDispatcher} from "svelte";
    import {CirclesSafe} from "../models/circlesSafe";

    export let ownerAddress: string = "";
    export let selectedSafe: CirclesSafe;
    export let circlesSafes: CirclesSafe[];
    export let canSelect: boolean = true;

    const dispatch = createEventDispatcher();
    const findSafeByOwnerStore = createFindSafesByOwner();
    findSafeByOwnerStore.subscribe((safes) => {
        circlesSafes = safes;
    });
    $: {
        findSafeByOwnerStore.search(ownerAddress);
    }

    function onSafeSelected(circlesSafe: CirclesSafe) {
        if (!canSelect) {
            return;
        }
        selectedSafe = circlesSafe;
        dispatch('safeSelected', circlesSafe);
    }
</script>
<div class="m-3">
    <ul class="w-full rounded-lg mt-2 mb-3 text-neutral-content">
        {#if !$findSafeByOwnerStore}
            <li class="text-center">Loading ...</li>
        {:else if $findSafeByOwnerStore.length === 0}
            <li class="text-center">No results</li>
        {:else}
            {#each circlesSafes as circlesSafe, i}
                <li class="mb-2" class:cursor-pointer={canSelect} class:bg-info={selectedSafe === circlesSafe}>
                    <CirclesSafeListItem on:click={() => onSafeSelected(circlesSafe)}
                                         circlesSafe={circlesSafe} />
                </li>
            {/each}
        {/if}
    </ul>
</div>
