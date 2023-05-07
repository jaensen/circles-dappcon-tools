<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import {CirclesSafe} from "../models/circlesSafe";
    import {getCrcBalance, getMaxFlow} from "../api";
    import {crcToTc} from "@jaensen/timecircles";
    import Web3 from "web3";
    import {createFindPaymentPath} from "../stores/factories/createFindPaymentPath";
    import {createFindCrcBalance} from "../stores/factories/createFindCrcBalance";
    import {createFindHoGBalance} from "../stores/factories/createFindHoGBalance";

    export let circlesSafe: CirclesSafe;
    export let toAddress: string;
    export let web3: Web3;

    let mintAmount: number;

    const paymentPathStore = createFindPaymentPath();
    const crcBalanceStore = createFindCrcBalance();
    const hogBalanceStore = createFindHoGBalance();

    onMount(async () => {
        if (circlesSafe?.safeAddress && toAddress) {
            paymentPathStore.search({
                from: circlesSafe.safeAddress,
                to: toAddress,
                amount: "99999999999999999000000000000000000",
                web3: web3
            });
        }
        if (circlesSafe?.safeAddress) {
            crcBalanceStore.search({address: circlesSafe.safeAddress});
            hogBalanceStore.search({address: circlesSafe.safeAddress, web3: web3});
        }
    });

    const dispatch = createEventDispatcher();
</script>

<div class="hero min-h-screen" style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
        <div>
            {#if !$crcBalanceStore.result}
                <progress class="progress w-56"></progress>
                <p class="text-info">Loading your Circles balance ...</p>
            {:else if $crcBalanceStore.result}
                <p>Your Circles balance: </p>
                <h1 class="mb-5 text-5xl font-bold">{Math.floor(crcToTc(Date.now(), Number.parseFloat(Web3.utils.fromWei($crcBalanceStore.result, "ether"))))} Circles</h1>
            {:else if $crcBalanceStore.error}
                <p class="text-error">
                    An error occurred while loading your Circles balance:<br/>
                    {$paymentPathStore.error.message}
                </p>
            {/if}
            {#if !$hogBalanceStore.result}
                <progress class="progress w-56"></progress>
                <p class="text-info">Loading your HoG balance ...</p>
            {:else if $hogBalanceStore.result}
                <p>Your HoG balance: </p>
                <h1 class="mb-5 text-5xl font-bold">{$hogBalanceStore.result} HoG</h1>
            {:else if $hogBalanceStore.error}
                <p class="text-error">
                    An error occurred while loading your HoG balance:<br/>
                    {$paymentPathStore.error.message}
                </p>
            {/if}
            {#if !$paymentPathStore.result}
                <progress class="progress w-56"></progress>
                <p class="text-info">Calculating your token minting limit ...</p>
            {:else if $paymentPathStore.error}
                <p class="text-error">
                    An error occurred while calculating your token minting limit:<br/>
                    {$paymentPathStore.error.message}
                </p>
            {:else if $paymentPathStore.result?.maxFlow}
                <p>You can mint: </p>
                <h2 class="mb-5 text-3xl font-bold">{Math.floor(Number.parseFloat(web3.utils.fromWei($paymentPathStore.result.maxFlow, "ether")))} HoG</h2>
            {/if}
            {#if $paymentPathStore.result && $paymentPathStore?.result?.maxFlow}
                <div class="form-control">
                    <input type="number"
                           class="input input-bordered w-full max-w-xs text-info mb-5"
                           placeholder="Amount"
                           min="0"
                           max={Math.floor(Number.parseFloat(web3.utils.fromWei($paymentPathStore.result.maxFlow, "ether")))}
                           bind:value={mintAmount} />
                    <button on:click={() => dispatch("mint", mintAmount)} class="btn btn-primary">Mint HoG</button>
                </div>
            {/if}
        </div>
    </div>
</div>
