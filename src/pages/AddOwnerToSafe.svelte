<script lang="ts">
    import Web3 from "web3";
    import Safe, { Web3Adapter } from "@safe-global/protocol-kit";
    import HDWalletProvider from "@truffle/hdwallet-provider";
    import { mnemonicToEntropy } from "bip39";
    import { CirclesSafe } from "../models/circlesSafe";
    import { createEventDispatcher } from "svelte";
    import { RpcEndpoint } from "../consts";

    export let mnemonicPhrase: string;
    export let newOwnerAddress: string;
    export let currentOwnerAddresses: string[];
    export let selectedSafe: CirclesSafe;

    const dispatch = createEventDispatcher();

    let web3: Web3;
    let safeSdk: Safe;

    let working = false;
    let error = false;
    let status: string;

    async function setSelectedSafe(safe: CirclesSafe) {
        working = true;
        status = `Initializing provider ...`;
        const provider = new HDWalletProvider(<any>{
            privateKeys: [mnemonicToEntropy(mnemonicPhrase)],
            providerOrUrl: RpcEndpoint,
        });
        web3 = new Web3(provider);

        status = `Initializing safe sdk ...`;
        const ethAdapter = new Web3Adapter({
            web3,
            signerAddress: provider.getAddress(),
        });

        safeSdk = await Safe.create({
            ethAdapter,
            safeAddress: safe.safeAddress,
            isL1SafeMasterCopy: false,
        });

        currentOwnerAddresses = (await safeSdk.getOwners()).map((o) =>
            o.toLowerCase()
        );
        working = false;
    }

    $: {
        setSelectedSafe(selectedSafe);
    }

    async function addOwnerToSafe() {
        error = false;
        working = true;
        try {
            status = "Signing 'addOwner' transaction ...";
            const addOwnerTx = await safeSdk.createAddOwnerTx({
                ownerAddress: newOwnerAddress,
                threshold: 1,
            });

            const safeTxHash = await safeSdk.getTransactionHash(addOwnerTx);
            const signature = await safeSdk.signTransactionHash(safeTxHash);
            addOwnerTx.addSignature(signature);

            status = "Sending 'addOwner' transaction ...";
            const executeTxResponse = await safeSdk.executeTransaction(
                addOwnerTx
            );
            const contractReceipt =
                await executeTxResponse.transactionResponse?.wait();
            console.log("contractReceipt", contractReceipt);

            status = "Transaction successful!";
            error = false;

            dispatch("success", selectedSafe);
        } catch (e) {
            console.error(e);
            status = "Transaction failed: " + e.message;
            error = true;
        } finally {
            working = false;
        }
    }
</script>

<div class="hero min-h-screen bg-primary">
    <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
            {#if currentOwnerAddresses?.indexOf(newOwnerAddress.toLowerCase()) > -1}
                <h1 class="mb-5 text-5xl font-bold text-primary">
                    Your wallet is already an owner of this safe
                </h1>
                <p class="mb-5 text-primary">
                    You can already control this Circles Safe with your wallet.
                    There's nothing to do here.
                </p>
                <button
                    on:click={() => dispatch("success", selectedSafe)}
                    class="btn btn-primary">Finish</button
                >
            {:else}
                <h1 class="mb-5 text-5xl font-bold text-primary">
                    Add your EOA as Safe owner
                </h1>
                <p class="mb-5 text-primary">
                    We now use your Circles seed phrase to add <br />
                    <b>{newOwnerAddress}</b><br /> as owner of <br />
                    <b>{selectedSafe.safeAddress}</b>.
                </p>
                {#if web3}
                    {#if !working && !error}
                        <button
                            on:click={addOwnerToSafe}
                            class="btn btn-primary text-primary"
                            >Add owner</button
                        >
                    {:else if error}
                        <button
                            on:click={addOwnerToSafe}
                            class="btn btn-active text-primary"
                            >Retry: Add owner</button
                        >
                        <p class="text-error">{status}</p>
                    {:else}
                        <progress class="progress w-56" />
                        <p class="text-info">{status}</p>
                    {/if}
                {:else}
                    <p class="text-error text-primary">
                        Error: Couldn't use the connected wallet as web3
                        provider.
                    </p>
                {/if}
            {/if}
        </div>
    </div>
</div>
