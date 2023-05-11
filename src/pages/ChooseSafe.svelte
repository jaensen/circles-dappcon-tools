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

<div id={anchorElementId} />
<div
    class="hero min-h-screen bg-blue mx-auto w-full flex flex-col justify-center select-safe"
>
    <div class="w-full">
        <div class="text-center text-neutral-content">
            <h1 class="mb-5 text-5xl font-bold text-primary">
                Select your safe
            </h1>
            {#if circlesSafes && circlesSafes.length > 1}
                <p class="mb-5 text-primary">
                    You have multiple Circles Safes. Please select one from
                    below.
                </p>
            {:else if circlesSafes && circlesSafes.length === 1}
                <p class="mb-5 text-primary">Click on the Safe to continue.</p>
            {:else if circlesSafes && circlesSafes.length === 0}
                <p class="mb-5 text-primary">
                    Your wallet isn't connected to any Circles Safe yet.
                </p>
            {/if}
        </div>
        <div class="h-screen max-h-[50vh] overflow-y-auto mb-5">
            <CirclesSafeList
                bind:ownerAddress
                bind:circlesSafes
                on:safeSelected
            />
        </div>
        {#if showImport}
            <a on:click class="flex p-3 text-center">
                <div class="flex-grow text-neutral-content">
                    <button
                        on:click={() => dispatcher("import")}
                        class="w-1/3 btn btn-primary bg-blue">Import</button
                    >
                </div>
            </a>
        {/if}
        {#if showSignup}
            <a on:click class="flex p-3 text-center">
                <div class="flex-grow text-neutral-content">
                    <button
                        on:click={() => dispatcher("signup")}
                        class="w-1/3 btn btn-primary bg-blue">Sign-up</button
                    >
                </div>
            </a>
        {/if}
    </div>
</div>
