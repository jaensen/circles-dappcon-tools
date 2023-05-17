<script lang="ts">
  import { push } from "svelte-spa-router";
  import "../tailwind.css";
  import Frame from "../components/Frame.svelte";
  export let routeTo: string = "/connect-wallet";
</script>

<Frame>
  <h1 class="mb-5 text-5xl font-bold text-primary">Hello there</h1>
  <p class="mb-5">
    This tool connects your familiar Wallet to your Circles Safe.
  </p>
  <button class="btn btn-outline text-primary" on:click={() => push(routeTo)}
    >Get started</button
  >
</Frame>
