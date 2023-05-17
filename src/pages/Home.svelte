<script lang="ts">
  import { push } from "svelte-spa-router";
  import "../tailwind.css";

  export let routeTo: string = "/connect-wallet";
</script>

<div class="absolute py-2.5 px-5">
  <img src="/images/dappconf-blue.png" class="w-[60px]" alt="DappConf" />
</div>
<div class="flex h-screen px-5 bg-blue text-primary">
  <div class="m-auto text-center">
    <h1 class="mb-5 text-5xl font-bold">Hello there</h1>
    <p class="mb-5">
      This tool connects your familiar Wallet to your Circles Safe.
    </p>
    <button class="btn btn-outline text-primary" on:click={() => push(routeTo)}
      >Get started</button
    >
  </div>
</div>
