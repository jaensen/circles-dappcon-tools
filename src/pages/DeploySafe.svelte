<script lang="ts">
    import Web3 from "web3";
    import {SafeAccountConfig, SafeFactory, Web3Adapter} from "@safe-global/protocol-kit";
    import {createEventDispatcher} from "svelte";

    export let web3: Web3;
    export let owner: string;
    export let threshold: number = 1;

    let working = false;
    let error = false;
    let status: string;
    let done = false;

    const dispatch = createEventDispatcher();

    async function deploySafe() {
        if (!owner || owner === "") {
            status = `No owner provided`;
            error = true;
            return;
        }

        try {
            error = false;
            working = true;
            status = `Initializing provider ...`;

            const ethAdapter = new Web3Adapter({
                web3,
                signerAddress: owner
            });

            status = `Deploying safe ...`;
            const safeFactory = await SafeFactory.create({ethAdapter, isL1SafeMasterCopy: false})
            const safeAccountConfig: SafeAccountConfig = {
                owners: [owner],
                threshold: threshold
            };
            console.log("safeAccountConfig:", safeAccountConfig);

            const safe = await safeFactory.deploySafe({safeAccountConfig});
            status = `Address: ${safe.getAddress()}`;

            dispatch('safeDeployed', safe);
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
            <h1 class="mb-5 text-5xl font-bold">Deploy a new Safe</h1>
            <p class="mb-5">Click the button below to deploy a new Circles Safe on the Gnosis Chain</p>
            {#if !working && !error && !done}
                <button on:click={deploySafe} class="btn btn-primary">Deploy</button>
            {:else if error}
                <button on:click={deploySafe} class="btn btn-active">Retry: Deploy</button>
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
