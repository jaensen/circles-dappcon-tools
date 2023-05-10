<script lang="ts">
    import SeedPhraseInput from "../components/SeedPhraseInput.svelte";
    import { jumpToAnchor } from "../utils.ts";

    export let hasValidKey = false;
    export let privateKey = "";
    export let address = "";
    export let mnemonicPhrase: string = "";
</script>

<div class="hero min-h-screen bg-black">
    <div class="hero-content">
        <div>
            <div class="text-center text-neutral-content">
                <h1 class="mb-5 text-5xl font-bold text-primary">
                    Enter your seedphrase
                </h1>
                <p class="mb-5 text-primary">
                    Please enter the seed phrase you stored when you created
                    your circles account. You can copy & paste the full phrase
                    in the first cell.
                </p>
            </div>
            <div class="mb-5">
                <SeedPhraseInput
                    bind:isValidMnemonic={hasValidKey}
                    bind:privateKey
                    bind:mnemonicPhrase
                    bind:address
                />
            </div>
            <div class="text-center text-neutral-content">
                {#if hasValidKey && address !== ""}
                    <button
                        on:click={() => {
                            console.log("DACIAN");
                            jumpToAnchor("select-safe");
                        }}
                        class="btn btn-primary text-primary"
                        >Proceed with address</button
                    >
                {/if}
            </div>
        </div>
    </div>
</div>
