<script lang="ts">
    import Safe, {Web3Adapter} from "@safe-global/protocol-kit";
    import Web3 from "web3";
    import {HUB_ABI} from "../abis/hub";
    import {HubAddress} from "../consts";
    import {CirclesSafe} from "../models/circlesSafe";
    import Frame from "../components/Frame.svelte";
    import {TOKEN_ABI} from "../abis/Token";
    import {connectedWalletAddress} from "../stores/singletons/connectedWalletAddress";
    import {TransactionReceipt} from "web3-core";

    export let web3: Web3;
    export let circlesSafe: CirclesSafe;

    enum MintingState {
        Idle,
        Minting,
        Error,
        Success
    }

    let mintingState = MintingState.Idle;
    let status = "";

    async function findCirclesToken(): Promise<string> {
        if (!circlesSafe?.safeAddress) {
            throw new Error("No circles safe");
        }
        const hubContract = new web3.eth.Contract(HUB_ABI, HubAddress);
        return await hubContract.methods.userToToken(circlesSafe.safeAddress).call();
    }

    async function mintUbi(tokenAddress: string): Promise<TransactionReceipt> {
        if (!circlesSafe?.safeAddress) {
            throw new Error("No circles safe");
        }

        const tokenContract = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
        const web3Adapter = new Web3Adapter({
            web3,
            signerAddress: $connectedWalletAddress
        });
        const safe: Safe = await Safe.create({ethAdapter: web3Adapter, safeAddress: circlesSafe.safeAddress})
        const safeTx = await safe.createTransaction({
            safeTransactionData: {
                to: tokenAddress,
                value: "0",
                data: tokenContract.methods.update().encodeABI()
            }
        });

        const signedSafeTransaction = await safe.signTransaction(safeTx);
        const transactionResult = await safe.executeTransaction(signedSafeTransaction);
        return transactionResult.promiEvent;
    }

    async function onMintClicked() {
        try {
            mintingState = MintingState.Minting;

            status = "Finding token address...";
            const tokenAddress = await findCirclesToken();

            status = "Minting...";
            const receipt = await mintUbi(tokenAddress);
            console.log(receipt);

            mintingState = MintingState.Success;
            status = "Success!";
        } catch (e) {
            mintingState = MintingState.Error;
            status = e.message;
            throw e;
        }
    }
</script>

<Frame backgroundColor="bg-black">
    <h1 class="mb-5 text-5xl font-bold text-primary">Mint UBI</h1>
    {#if mintingState !== MintingState.Success}
        <div class="items-center form-control">
            <button
                    disabled={mintingState === MintingState.Minting}
                    on:click={onMintClicked}
                    class="bg-black btn btn-primary text-primary"
            >{mintingState !== MintingState.Error ? "" : "Retry: "}Mint</button>
        </div>
        {#if status && status.trim() !== ""}
            <div class="mb-4">
                {#if mintingState === MintingState.Minting}
                    <div class="loader">
                        <div class="loaderBar" />
                    </div>
                {/if}
                <p class:text-info={mintingState !== MintingState.Error} class:text-error={mintingState === MintingState.Error}>
                    {@html status}
                </p>
            </div>
        {/if}
    {:else}
        <p class="text-success text-primary">Minting completed successfully.</p>
    {/if}
</Frame>
