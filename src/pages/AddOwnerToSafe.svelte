<script lang="ts">
    import Web3 from "web3";
    import Safe, {Web3Adapter} from '@safe-global/protocol-kit'
    import HDWalletProvider from "@truffle/hdwallet-provider";
    import {mnemonicToEntropy} from "bip39";
    import {CirclesSafe} from "../models/circlesSafe";
    import {createEventDispatcher, onMount} from "svelte";
    import {RpcEndpoint} from "../consts";

    export let mnemonicPhrase: string;
    export let newOwnerAddress: string;
    export let selectedSafe: CirclesSafe;

    const dispatch = createEventDispatcher();

    let web3: Web3;
    let safeSdk: Safe;

    let working = false;
    let error = false;
    let status: string;

    onMount(async () => {
        working = true;
        status = `Initializing provider ...`;
        const provider = new HDWalletProvider(<any>{
            privateKeys:[mnemonicToEntropy(mnemonicPhrase)],
            providerOrUrl: RpcEndpoint,

        });
        web3 = new Web3(provider);

        status = `Initializing safe sdk ...`;
        const ethAdapter = new Web3Adapter({
            web3,
            signerAddress: provider.getAddress()
        });

        safeSdk = await Safe.create({
            ethAdapter,
            safeAddress: selectedSafe.safeAddress,
            isL1SafeMasterCopy: false
        });

        working = false;
    });

    async function addOwnerToSafe()
    {
        error = false;
        working = true;
        try {
            status = "Signing 'addOwner' transaction ...";
            const addOwnerTx = await safeSdk.createAddOwnerTx({ownerAddress: newOwnerAddress, threshold: 1})
            const safeTxHash = await safeSdk.getTransactionHash(addOwnerTx)
            const signature = await safeSdk.signTransactionHash(safeTxHash);
            addOwnerTx.addSignature(signature);

            status = "Sending 'addOwner' transaction ...";
            const executeTxResponse = await safeSdk.executeTransaction(addOwnerTx)
            const contractReceipt = await executeTxResponse.transactionResponse?.wait();
            console.log("contractReceipt", contractReceipt);

            status = "Transaction successful!";
            error = false;

            dispatch("success", selectedSafe);
        } catch (e) {
            console.error(e)
            status = "Transaction failed: " + e.message;
            error = true;
        } finally {
            working = false;
        }
    }

</script>

<div class="hero min-h-screen" style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold">Add your EOA as Safe owner</h1>
            <p class="mb-5">We now use your Circles seed phrase to add <br/>
                <b>{newOwnerAddress}</b><br/> as owner of <br/>
                <b>{selectedSafe.safeAddress}</b>.</p>
            {#if web3}
                {#if !working && !error}
                    <button on:click={addOwnerToSafe} class="btn btn-primary">Add owner</button>
                {:else if error}
                    <button on:click={addOwnerToSafe} class="btn btn-active">Retry: Add owner</button>
                    <p class="text-error">{status}</p>
                {:else}
                    <button class="loading btn btn-active">Working ...</button>
                    <p class="text-info">{status}</p>
                {/if}
            {:else}
                <p class="text-error">Error: Couldn't use the connected wallet as web3 provider.</p>
            {/if}
        </div>
    </div>
</div>
