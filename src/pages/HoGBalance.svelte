<script lang="ts">
  import { onMount } from "svelte";
  import { type CirclesSafe } from "../models/circlesSafe";
  import { crcToTc } from "@jaensen/timecircles";
  import type Web3 from "web3";
  import { createFindCrcBalance } from "../stores/factories/queries/createFindCrcBalance";
  import { createFindHoGBalance } from "../stores/factories/queries/createFindHoGBalance";
  import { connectedWalletAddress } from "../stores/singletons/connectedWalletAddress";

  export let circlesSafe: CirclesSafe;
  export let web3: Web3;

  const crcBalanceStore = createFindCrcBalance();
  const hogSafeBalanceStore = createFindHoGBalance();
  const hogWalletBalanceStore = createFindHoGBalance();

  onMount(async () => {
    if (circlesSafe?.safeAddress) {
      crcBalanceStore.search({ address: circlesSafe.safeAddress });
      hogSafeBalanceStore.search({
        address: circlesSafe.safeAddress,
        web3: web3,
      });
    }
    if ($connectedWalletAddress) {
      hogWalletBalanceStore.search({
        address: $connectedWalletAddress,
        web3: web3,
      });
    }
  });
</script>

<div>
  {#if !$crcBalanceStore.result}
    <div class="loader">
      <div class="loaderBar" />
    </div>
    <p class="text-info text-primary">Loading your Circles balance ...</p>
  {:else if $crcBalanceStore.result}
    <p class="text-primary">Your Circles balance:</p>
    <h1 class="mb-5 text-5xl font-bold text-primary">
      {Math.floor(
        crcToTc(
          Date.now(),
          Number.parseFloat(
            Web3.utils.fromWei($crcBalanceStore.result, "ether")
          )
        )
      )} Circles
    </h1>
  {:else if $crcBalanceStore.error}
    <p class="text-error text-primary">
      An error occurred while loading your Circles balance:<br />
      {$crcBalanceStore.error.message}
    </p>
  {/if}
  {#if $connectedWalletAddress && (!$hogSafeBalanceStore.result || !$hogWalletBalanceStore.result)}
    <div class="loader">
      <div class="loaderBar" />
    </div>
    <p class="text-info text-primary">Loading your HoG balances ...</p>
  {:else if $connectedWalletAddress && $hogSafeBalanceStore.result && $hogWalletBalanceStore.result}
    {#if $hogSafeBalanceStore.result !== "0.00"}
      <p class="text-primary">Your HoG balance (Safe):</p>
      <h1 class="mb-5 text-5xl font-bold text-primary">
        {$hogSafeBalanceStore.result} HoG
      </h1>
    {/if}
    {#if $hogWalletBalanceStore.result !== "0.00"}
      <p class="text-primary">Your HoG balance (Wallet):</p>
      <h1 class="mb-5 text-5xl font-bold text-primary">
        {$hogWalletBalanceStore.result} HoG
      </h1>
    {/if}
  {:else if $hogSafeBalanceStore.error || $hogWalletBalanceStore.error}
    <p class="text-error text-primary">
      An error occurred while loading your HoG balance:<br />
      {$hogSafeBalanceStore.error?.message ?? ""}
      {$hogWalletBalanceStore.error?.message ?? ""}
    </p>
  {/if}
</div>
