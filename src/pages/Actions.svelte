<script lang="ts">
  import { selectedSafe } from "../stores/singletons/selectedSafe";
  import HoGBalance from "./HoGBalance.svelte";
  import { web3 } from "../stores/singletons/web3";

  export let onMintHog: () => void;
  // export let onMintCircles: () => void;
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
  <p class="mb-5 mt-10 text-primary">
    You can do the following things with your Circles Safe:
  </p>
  <button
    class="mb-5 btn btn-outline text-primary rounded-full w-80 normal-case"
    on:click={onMintHog}>MINT HoG</button
  ><br />
  <!-- <button
    class="mb-5 btn btn-outline text-primary rounded-full w-80"
    on:click={onMintCircles}>Mint Circles</button
  ><br /> -->
  <button
    class="mb-5 btn btn-outline text-primary rounded-full w-80"
    on:click={onSelectSafe}>Select different safe</button
  ><br />
  <button
    class="mb-5 btn btn-outline text-primary rounded-full w-80"
    on:click={onSelectWallet}>Connect different wallet</button
  ><br />
  <button
    class="mb-5 btn btn-outline text-primary rounded-full w-80 normal-case"
    on:click={() =>
      window.open("https://swap.cow.fi/#/100/swap/XDAI/HoG", "_blank")}
    >BUY HoG ON COWSWAP</button
  ><br />
  <button
    class="mb-5 btn btn-outline text-primary rounded-full w-80"
    on:click={() =>
      window.open(
        "https://app.unlock-protocol.com/checkout?id=463aa6f1-b051-4c83-842c-b374c1473f74",
        "_blank"
      )}>Buy DappCon Tickets</button
  ><br />
</div>
