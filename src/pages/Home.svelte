<script lang="ts">
    import { push } from "svelte-spa-router";
    import "../tailwind.css";

    export let routeTo: string = "/connect-wallet";
</script>

<div class="absolute py-2.5 px-5">
    <img src="/images/dappconf-blue.png" class="w-[60px]" alt="DappConf" />
</div>
<div class="hero min-h-screen bg-blue">
    <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
            <h1 class="mb-5 text-5xl font-bold text-primary">Hello there</h1>
            <p class="mb-5 text-primary">
                This tool connects your familiar Wallet to your Circles Safe.
            </p>
            <button
                class="btn btn-primary text-primary bg-blue"
                on:click={() => push(routeTo)}>Get started</button
            >
        </div>
    </div>
</div>
