<script lang="ts">
    import SeedPhraseInput from "../components/SeedPhraseInput.svelte";
    import {createEventDispatcher} from "svelte";

    export let hasValidKey = false;
    export let privateKey = '';
    export let address = '';
    export let mnemonicPhrase:string = '';

    const dispatch = createEventDispatcher();
</script>
<div class="hero min-h-screen" style="background-image: url(/images/photo-1507358522600-9f71e620c44e.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content">
        <div>
            <div class="text-center text-neutral-content">
                <h1 class="mb-5 text-5xl font-bold">Enter your seedphrase</h1>
                <p class="mb-5">Please enter the seed phrase you stored when you created your circles account.
                    You can copy & paste the full phrase in the first cell.</p>
            </div>
            <div class="mb-5">
                <SeedPhraseInput
                        bind:isValidMnemonic={hasValidKey}
                        bind:privateKey={privateKey}
                        bind:mnemonicPhrase={mnemonicPhrase}
                        bind:address={address}/>
            </div>
            <div class="text-center text-neutral-content">
                {#if hasValidKey && address !== ''}
                    <button on:click={() => dispatch('eoaLoaded', address)}
                    class="btn btn-primary">Proceed with<br/> {address}</button>
                {/if}
            </div>
        </div>
    </div>
</div>
