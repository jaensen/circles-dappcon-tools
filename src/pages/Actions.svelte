<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { CirclesSafe } from "../models/circlesSafe";
    export let selectedSafe: CirclesSafe;

    const dispatch = createEventDispatcher();
</script>

<div
    class="hero min-h-screen"
    style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);"
>
    <div class="hero-overlay bg-opacity-60" />
    <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold">
                Hello {selectedSafe.userName ?? selectedSafe.safeAddress}!
            </h1>
            <p class="mb-5">
                This tool connects your familiar Wallet to your Circles Safe.
            </p>
            <button
                class="btn btn-primary"
                on:click={(event) => {
                    dispatch("mintHoG");
                }}>Mint HoG</button
            >
        </div>
    </div>
</div>
