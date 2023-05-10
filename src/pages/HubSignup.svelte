<script lang="ts">
    import Safe from "@safe-global/protocol-kit";
    import { createEventDispatcher } from "svelte";
    import { HUB_ABI } from "../abis/hub";
    import { HubAddress } from "../consts";
    import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
    import { web3 } from "../stores/singletons/web3";
    import { push } from "svelte-spa-router";

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
            status = `Generating 'Signup' call data ...`;
            const signupCallData = new $web3.eth.Contract(
                HUB_ABI,
                HubAddress
            ).methods
                .signup()
                .encodeABI();
            const safeTransactionData: SafeTransactionDataPartial = {
                data: signupCallData,
                to: HubAddress,
                value: "0",
            };

            status = `Creating safe transaction ...`;
            const safeTransaction = await safe.createTransaction({
                safeTransactionData: safeTransactionData,
            });

            status = `Signing safe transaction ...`;
            const signedTx = await safe.signTransaction(safeTransaction);

            status = `Executing safe transaction ...`;
            const transactionResult = await safe.executeTransaction(signedTx);

            status = `Signed up!`;
            dispatch("signupCompleted", transactionResult);
            push("/");
            done = true;
        } catch (e) {
            status = `Error: ${e.message}`;
            error = true;
        } finally {
            working = false;
        }
    }
</script>

<div class="hero min-h-screen bg-primary">
    <div class="hero-content text-center text-neutral-content">
        <div>
            <h1 class="mb-5 text-5xl font-bold text-primary">
                Circles registration
            </h1>
            <p class="mb-5 text-primary">
                Click the button below to sign up at the Circles Hub.
            </p>
            {#if !working && !error && !done}
                <button
                    on:click={deploySafe}
                    class="btn btn-primary mb-5 text-primary">Signup</button
                >
            {:else if error}
                <button
                    on:click={deploySafe}
                    class="btn btn-active mb-5 text-primary"
                    >Retry: Signup</button
                >
                <p class="text-error">{status}</p>
            {:else if done}
                <p class="text-success">{status}</p>
            {:else}
                <progress class="progress w-56" />
                <p class="text-info">{status}</p>
            {/if}
        </div>
    </div>
</div>
