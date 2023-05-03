<script lang="ts">
    import CirclesSafeList from "../components/CirclesSafeList.svelte";
    import {CirclesSafe} from "../models/circlesSafe";
    import {createEventDispatcher} from "svelte";

    export let ownerAddress = '';
    export let showSignup = true;
    export let showImport = true;

    let circlesSafes: CirclesSafe[];

    const dispatcher = createEventDispatcher();
</script>
<div class="hero min-h-screen" style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content">
        <div>
            <div class="text-center text-neutral-content">
                <h1 class="mb-5 text-5xl font-bold">Select your safe</h1>
                {#if circlesSafes && circlesSafes.length > 1}
                    <p class="mb-5">You have multiple Circles Safes. Please select one from below.</p>
                {:else if circlesSafes && circlesSafes.length === 1}
                    <p class="mb-5">Click on the Safe to continue.</p>
                {:else if circlesSafes && circlesSafes.length === 0}
                    <p class="mb-5">Your wallet isn't connected to any Circles Safe yet.</p>
                {/if}
            </div>
            <div class="h-screen max-h-[50vh] overflow-y-auto mb-5">
                <CirclesSafeList bind:ownerAddress={ownerAddress}
                                 bind:circlesSafes={circlesSafes}
                                 on:safeSelected />
            </div>
            {#if showImport}
                <a on:click class="flex p-3 text-center">
                    <div class="flex-grow text-neutral-content">
                        <button on:click={() => dispatcher("import")} class="w-1/3 btn btn-primary">Import</button>
                    </div>
                </a>
            {/if}
            {#if showSignup}
                <a on:click class="flex p-3 text-center">
                    <div class="flex-grow text-neutral-content">
                        <button on:click={() => dispatcher("signup")} class="w-1/3 btn btn-primary">Sign-up</button>
                    </div>
                </a>
            {/if}
        </div>
    </div>
</div>
