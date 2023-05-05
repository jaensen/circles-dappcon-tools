<script lang="ts">
    import Web3 from "web3";
    import Safe from "@safe-global/protocol-kit";
    import {createEventDispatcher} from "svelte";
    import {HUB_ABI} from "../abis/hub";
    import {HubAddress} from "../consts";
    import {SafeTransactionDataPartial} from "@safe-global/safe-core-sdk-types";

    export let web3: Web3;
    export let safe: Safe;

    let working = false;
    let error = false;
    let status: string;
    let done = false;

    const dispatch = createEventDispatcher();

    async function deploySafe() {
        try {
            working = true;
            error = false;
            status = `Signing up ...`;

            const signupCallData = new web3.eth.Contract(HUB_ABI, HubAddress).methods.signup().encodeABI();
            const safeTransactionData: SafeTransactionDataPartial = {
                data: signupCallData,
                to: HubAddress,
                value: '0'
            };

            const safeTransaction = await safe.createTransaction({
                safeTransactionData: safeTransactionData
            });

            const transactionResult = await safe.executeTransaction(safeTransaction);

            status = `Signed up!`;
            dispatch('signupCompleted', transactionResult);
            done = true;
        } catch (e) {
            status = `Error: ${e.message}`;
            error = true;
        } finally {
            working = false;
        }
    }
</script>

<div class="hero min-h-screen" style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
        <div>
            <h1 class="mb-5 text-5xl font-bold">Circles registration</h1>
            <p class="mb-5">Click the button below to sign up at the Circles Hub.</p>
            {#if !working && !error && !done}
                <button on:click={deploySafe} class="btn btn-primary">Signup</button>
            {:else if error}
                <button on:click={deploySafe} class="btn btn-active">Retry: Signup</button>
                <p class="text-error">{status}</p>
            {:else if done}
                <p class="text-success">{status}</p>
            {:else}
                <button class="loading btn btn-active">Working ...</button>
                <p class="text-info">{status}</p>
            {/if}
        </div>
    </div>
</div>
