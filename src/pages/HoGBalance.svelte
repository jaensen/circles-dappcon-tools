<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {CirclesSafe} from "../models/circlesSafe";
    import {createFindHoGBalance} from "../stores/factories/createFindHoGBalance";
    import {web3} from "../stores/singletons/web3";
    import {connectedWalletAddress} from "src/stores/singletons/connectedWalletAddress";

    export let circlesSafe: CirclesSafe;

    let sendTo: string = $connectedWalletAddress;

    const hogBalanceStore = createFindHoGBalance();
    $: {
        if (circlesSafe?.safeAddress) {
            hogBalanceStore.search({address: circlesSafe.safeAddress, web3: $web3});
        }
    }

    const dispatch = createEventDispatcher();
</script>

<div class="hero min-h-screen" style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center">
        <div>
            {#if !$hogBalanceStore.result}
                <progress class="progress w-56"></progress>
                <p class="text-info">Loading your HoG balance ...</p>
            {:else if $hogBalanceStore.result}
                <p class="text-neutral-content">Your HoG balance: </p>
                <h1 class="mb-5 text-5xl font-bold text-neutral-content">{$hogBalanceStore.result} HoG</h1>
            {:else if $hogBalanceStore.error}
                <p class="text-error">
                    An error occurred while loading your HoG balance:<br/>
                    {$hogBalanceStore.error.message}
                </p>
            {/if}
            <div class="form-control mb-5">
                <p class="text-neutral-content">Transfer amount: </p>
                <label class="input-group">
                    <input type="text" placeholder="0" class="input input-bordered"/>
                    <span>HoG</span>
                </label>
            </div>
            <div class="form-control mb-5">
                <p class="text-neutral-content">Transfer to: </p>
                <input type="text" placeholder="0x..." bind:value={sendTo} class="input input-bordered"/>
            </div>
            <div class="form-control mb-5">
                <button class="btn btn-primary mb-5" on:click={() => {
                    console.log("sendTo", sendTo);
                }}>Send</button><br/>
            </div>
        </div>
    </div>
</div>
