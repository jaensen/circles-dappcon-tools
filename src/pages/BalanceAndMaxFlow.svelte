<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import {CirclesSafe} from "../models/circlesSafe";
    import {getCrcBalance, getMaxFlow} from "../api";
    import {crcToTc} from "@jaensen/timecircles";
    import Web3 from "web3";

    export let circlesSafe: CirclesSafe;
    export let toAddress: string;

    const loadingBalanceText = "Loading your Circles balance ..";
    const loadingFlowText = "Calculating max. amount ..";

    let crcBalance: string;
    let maxFlow: string;
    let mintAmount: number;

    let status: string[] = [];

    onMount(async () => {
        if (circlesSafe?.safeAddress) {
            status.push(loadingBalanceText);
            status=status;
            getCrcBalance(circlesSafe.safeAddress)
                .then(balance => {
                    crcBalance = crcToTc(Date.now(), Number.parseFloat(Web3.utils.fromWei(balance, "ether"))).toFixed(2);
                    status.splice(status.indexOf(loadingBalanceText), 1);
                    status=status;
                });
        }
        if (circlesSafe?.safeAddress && toAddress) {
            status.push(loadingFlowText);
            status=status;
            getMaxFlow(circlesSafe.safeAddress, toAddress, "99999999999999999000000000000000000")
                .then(flow => {
                    maxFlow = crcToTc(Date.now(), Number.parseFloat(Web3.utils.fromWei(flow, "ether"))).toFixed(2);
                    status.splice(status.indexOf(loadingFlowText), 1);
                    status=status;
                });
        }
    })

    const dispatch = createEventDispatcher();
</script>

<div class="hero min-h-screen" style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
        <div>
            {#if crcBalance}
                <p>Your balance: </p>
                <h1 class="mb-5 text-5xl font-bold">{crcBalance} Circles</h1>
            {/if}
            {#if maxFlow}
                <p>You can mint: </p>
                <h2 class="mb-5 text-3xl font-bold">{maxFlow} HoG</h2>
            {/if}
            {#if status.length > 0}
                <p class="text-info">{@html status.join("<br/>")}</p>
            {/if}
            {#if crcBalance && maxFlow}
                <div class="form-control">
                    <input type="number" class="form-input text-info" placeholder="Amount" min="0" max={maxFlow} bind:value={mintAmount}/>
                    <button on:click={() => dispatch("mint", mintAmount)} class="btn btn-primary">Mint HoG</button>
                </div>
            {/if}
        </div>
        <!--
        <FlowGraph/>
        -->
    </div>
</div>
