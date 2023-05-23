<script lang="ts">
  import { selectedSafe } from "../stores/singletons/selectedSafe";
  import HoGBalance from "./HoGBalance.svelte";
  import { web3 } from "../stores/singletons/web3";

  export let onMintHog: () => void;
  export let onMintCircles: () => void;
  export let onSelectSafe: () => void;
  export let onSelectWallet: () => void;
</script>

<div class="text-center">
  <h1 class="mb-5 text-5xl font-bold text-primary">
    Hello {$selectedSafe.userName?.trim() === "" || !$selectedSafe.userName
      ? $selectedSafe.safeAddress
      : $selectedSafe.userName}!
  </h1>
  <HoGBalance web3={$web3} circlesSafe={$selectedSafe} />
  <p class="mb-5 text-primary">
    You can do the following things with your Circles Safe:
  </p>
  <button
    class="mb-5 btn btn-outline text-primary rounded-full w-80"
    on:click={onMintHog}>Mint HoG</button
  ><br />
  <button
    class="mb-5 btn btn-outline text-primary rounded-full w-80"
    on:click={onMintCircles}>Mint Circles</button
  ><br />
  <button
    class="mb-5 btn btn-outline text-primary rounded-full w-80"
    on:click={onSelectSafe}>Select different safe</button
  ><br />
  <button
    class="mb-5 btn btn-outline text-primary rounded-full w-80"
    on:click={onSelectWallet}>Connect different wallet</button
  ><br />
</div>
