<script lang="ts">
    import {CirclesSafe} from "../models/circlesSafe";
    export let selectedSafe:CirclesSafe;
</script>

<div class="hero min-h-screen" style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
        <div>
            <h1 class="mb-5 text-5xl font-bold">Hello {(selectedSafe.userName?.trim() === "" || !selectedSafe.userName)
                ? selectedSafe.safeAddress
                : selectedSafe.userName}!</h1>
            <p class="mb-5">You can do the following things with your Circles Safe:</p>
            <button class="btn btn-primary mb-5" on:click={() => {}}>Mint HoG</button><br/>
            <button class="btn btn-primary mb-5" on:click={() => {}}>Transfer HoG</button><br/>
            <button class="btn btn-primary" on:click={() => {}}>Transfer CRC</button>
        </div>
    </div>
</div>
