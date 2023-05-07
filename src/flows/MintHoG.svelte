<script lang="ts">
    import Web3 from "web3";
    import {createEventDispatcher} from "svelte";
    import BalanceAndMaxFlow from "../pages/BalanceAndMaxFlow.svelte";
    import {CirclesSafe} from "../models/circlesSafe";
    import {HoGTokenAddress} from "../consts";
    import MintHoG from "../pages/MintHoG.svelte";

    export let web3: Web3;
    export let circlesSafe: CirclesSafe;

    let mintAmount = 0;

    function onMintHoG(amount: number) {
        mintAmount = amount;
    }

    function onMintConfirmed() {
    }

    const dispatch = createEventDispatcher();
</script>

{#if !web3}
    <p>'web3' not set</p>
{:else}
    <BalanceAndMaxFlow on:mint={e => onMintHoG(e.detail)}
                       web3={web3}
                       circlesSafe={circlesSafe}
                       toAddress={HoGTokenAddress} />
    {#if mintAmount > 0}
        <MintHoG web3={web3}
                 circlesSafe={circlesSafe}
                 mintAmount={mintAmount} />
    {/if}
{/if}
